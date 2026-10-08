import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  listApplications,
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";

const router = Router();
router.use(protect);

router.route("/").get(listApplications).post(createApplication);
router
  .route("/:id")
  .get(getApplication)
  .put(updateApplication)
  .delete(deleteApplication);

export default router;