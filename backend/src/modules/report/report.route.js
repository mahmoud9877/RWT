import express from "express";
import * as reportController from "./report.controller.js";
import { auth } from "../../middleware/auth.js";
import { upload } from "../../utils/uploadFile.js";
const router = express.Router();


router.post(
  "/",
  auth(["employee"]),
  upload.single("file"),
  reportController.createReport
);

router.get(
  "/",
  auth(["admin"]),
  reportController.getReports
);

router.get(
  "/my",
  auth(["employee"]),
  reportController.getEmployeeReports
);

router.get(
  "/:id",
  auth(["admin", "employee"]),
  reportController.getReportById
);

router.put(
  "/:id",
  auth(["admin"]),
  reportController.updateReport
);

router.delete(
  "/:id",
  auth(["admin"]),
  reportController.deleteReport
);

export default router;
