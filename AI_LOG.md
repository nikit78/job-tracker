# AI Usage Log

This log records how I used AI tools while building this project: what I asked, what the AI got wrong or missed, and how I fixed it.

**Primary AI tool:** Code0 (CodeZero) with `<agent used, e.g. GitHub Copilot CLI>`
**Other help:** I also used a general AI assistant (Claude) for project planning and for debugging environment issues. I have noted this below where it applies.

---

## Challenges Faced and How I Solved Them

### 1. File name casing error on Windows
- **Problem:** VS Code reported that `authController.js` and `authcontroller.js` differ only in casing. The file on disk had a lowercase `c`, but the import in `authRoutes.js` used an uppercase `C`.
- **Cause:** Windows treats both names as the same file, but the TypeScript checker in VS Code treats them as two different files.
- **Fix:** Renamed the file in two steps (to a temporary name, then to the exact name), reloaded the window, and made sure every import matches the file name exactly.
- **Lesson:** Linux servers (like Render) are case-sensitive, so a casing mismatch that "works" on Windows would break in deployment.
- **Help used:** AI assistant (Claude) for diagnosing the cause.

### 2. MongoDB Atlas `querySrv ECONNREFUSED`
- **Problem:** The server crashed on start with `DB connection failed: querySrv ECONNREFUSED _mongodb._tcp...mongodb.net`.
- **Investigation:** I ran `nslookup -type=SRV` against my default DNS, 1.1.1.1 and 8.8.8.8. All returned the correct SRV records, so my network DNS was fine and the Atlas connection string was valid.
- **Cause:** Node.js does its own SRV lookup and it failed on my network, even though the system resolver worked.
- **Fix:** Added `dns.setServers(["8.8.8.8", "1.1.1.1"])` in `config/db.js` as a local workaround. This should not be needed in deployment.
- **Help used:** AI assistant (Claude) suggested the diagnosis steps; I ran them and applied the fix.

---

## Code0 Entries

> Fill one entry for each real task done with Code0. Only write what actually happened.

### Entry 1: `<task name>`
- **Task:**
- **Prompt I gave:**
- **What the AI produced:**
- **What was wrong or missing:**
- **How I fixed it:**
- **What I learned:**

### Entry 2: `<task name>`
- **Task:**
- **Prompt I gave:**
- **What the AI produced:**
- **What was wrong or missing:**
- **How I fixed it:**
- **What I learned:**

<!-- Copy the block above for Entries 3, 4, 5, 6. -->