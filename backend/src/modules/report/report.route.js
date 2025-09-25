import express from "express";
import {
    createReport,
    getReports,
    getReportById,
    updateReport,
    deleteReport,
    getEmployeeReports,
} from "./report.controller.js";
import { auth } from "../../middleware/auth.js";
import { upload } from "../../utils/uploadFile.js";

const router = express.Router();

router.post("/",
    auth(['employee']),
    upload.single("file"),
    createReport);       // Create
router.get("/", auth(['admin']), getReports); // /report
router.get("/my", auth(), getEmployeeReports); // /report/my

router.get("/:id", getReportById);    // Get one
router.put("/:id", updateReport);     // Update
router.delete("/:id", deleteReport);  // Delete

export default router;
