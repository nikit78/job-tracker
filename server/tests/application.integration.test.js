import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import mongoose from "mongoose";
import app from "../app.js";
import { connectDB } from "../config/db.js";
import Application from "../models/Application.js";
import User from "../models/User.js";

const emailPrefix = `crud-test-${randomUUID()}`;
const firstEmail = `${emailPrefix}-first@example.test`;
const secondEmail = `${emailPrefix}-second@example.test`;
let server;
let baseUrl;
let applicationId;

async function request(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers)
  if (options.body) headers.set("Content-Type", "application/json")
  if (token) headers.set("Authorization", `Bearer ${token}`)
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers })
  const body = await response.json()
  return { response, body }
}

before(async () => {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error("MONGO_URI and JWT_SECRET are required to run API integration tests.");
  }

  await connectDB();
  server = app.listen(0);
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
  try {
    const users = await User.find({ email: { $in: [firstEmail, secondEmail] } }).select("_id");
    const userIds = users.map(({ _id }) => _id);
    if (userIds.length) await Application.deleteMany({ user: { $in: userIds } });
    await User.deleteMany({ email: { $in: [firstEmail, secondEmail] } });
  } finally {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
      });
    }
    await mongoose.disconnect();
  }
});

test("application CRUD is owner-scoped", async () => {
  const firstRegistration = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name: "CRUD Test First", email: firstEmail, password: "test-password-1" }),
  });
  assert.equal(firstRegistration.response.status, 201);
  assert.ok(firstRegistration.body.token);

  const secondRegistration = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name: "CRUD Test Second", email: secondEmail, password: "test-password-2" }),
  });
  assert.equal(secondRegistration.response.status, 201);

  const created = await request("/applications", {
    method: "POST",
    token: firstRegistration.body.token,
    body: JSON.stringify({
      company: "Integration Test Company",
      role: "Integration Test Engineer",
      status: "applied",
      location: "Remote",
    }),
  });
  assert.equal(created.response.status, 201);
  applicationId = created.body._id;
  assert.equal(created.body.company, "Integration Test Company");

  const listed = await request("/applications", { token: firstRegistration.body.token });
  assert.equal(listed.response.status, 200);
  assert.equal(listed.body.total, 1);
  assert.equal(listed.body.data[0]._id, applicationId);

  const read = await request(`/applications/${applicationId}`, { token: firstRegistration.body.token });
  assert.equal(read.response.status, 200);
  assert.equal(read.body.role, "Integration Test Engineer");

  const updated = await request(`/applications/${applicationId}`, {
    method: "PUT",
    token: firstRegistration.body.token,
    body: JSON.stringify({ status: "interview" }),
  });
  assert.equal(updated.response.status, 200);
  assert.equal(updated.body.status, "interview");

  const inaccessible = await request(`/applications/${applicationId}`, {
    token: secondRegistration.body.token,
  });
  assert.equal(inaccessible.response.status, 404);

  const deleted = await request(`/applications/${applicationId}`, {
    method: "DELETE",
    token: firstRegistration.body.token,
  });
  assert.equal(deleted.response.status, 200);

  const missing = await request(`/applications/${applicationId}`, {
    token: firstRegistration.body.token,
  });
  assert.equal(missing.response.status, 404);
});
