import cohere from "../../utils/chore.js";
import mammoth from "mammoth";
import fs from "fs";
import { extractTextFromPDF } from "../../utils/pdf.js";
import Report from "../../database/models/Report.model.js";
import User from "../../database/models/User.model.js";
import Task from "../../database/models/Task.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const createReport = asyncHandler(async (req, res) => {
  try {
    const { employee_id, task_id, text } = req.body;
    const file = req.file;

    const employee = await User.findByPk(employee_id);
    if (!employee) return res.status(404).json({ error: "Employee not found." });

    const task = await Task.findByPk(task_id);
    if (!task) return res.status(404).json({ error: "Task not found." });

    let finalText = text || "";
    let summary = null;

    if (file) {
      const mimeType = file.mimetype;
      const buffer = fs.readFileSync(file.path);

      if (mimeType === "application/pdf") {
        const data = await extractTextFromPDF(buffer);
        finalText = data.text;
      } else if (
        mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({ buffer });
        finalText = result.value;
      } else {
        return res.status(400).json({ error: "Unsupported file type." });
      }
    }

    if (!finalText || finalText.trim().length < 10) {
      return res
        .status(400)
        .json({ error: "Report text is too short or empty." });
    }

    const prompt = `
Summarize the following employee report clearly and concisely.
Use the same language as the input.
Do not add or invent any information.
Limit the summary to 5 bullet points or 5 short sentences.

Report:
${finalText}
`;

    const response = await cohere.chat({ message: prompt, temperature: 0.4 });
    if (!response?.text)
      return res.status(500).json({ error: "AI summarization failed." });

    summary = response.text.trim();

    const report = await Report.create({
      employee_id,
      task_id,
      file: file?.filename || null,
      text: finalText,
      summary,
    });

    res.status(201).json({ message: "Report created successfully", report });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating report", error: error.message });
  }
});

export const getEmployeeReports = asyncHandler(async (req, res) => {
  try {
    const employee_id = req.user.id;

    const reports = await Report.findAll({
      where: { employee_id },
      include: [
        { model: Task, as: "task", attributes: ["id", "title"] },
        { model: User, as: "employee", attributes: ["id", "name", "department"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching employee reports", error: error.message });
  }
});

export const getReports = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.query;
    const whereClause = userId ? { employee_id: userId } : {};

    const reports = await Report.findAll({
      where: whereClause,
      include: [
        { model: User, as: "employee", attributes: ["id", "name", "department"] },
        { model: Task, as: "task", attributes: ["id", "title"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reports", error: error.message });
  }
});

export const getReportById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByPk(id, {
      include: [
        { model: User, as: "employee", attributes: ["id", "name", "email"] },
        { model: Task, as: "task", attributes: ["id", "title"] },
      ],
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching report", error: error.message });
  }
});

export const updateReport = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id, task_id, file, text, summary } = req.body;

    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await report.update({ employee_id, task_id, file, text, summary });

    res.status(200).json({ message: "Report updated successfully", report });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating report", error: error.message });
  }
});

export const deleteReport = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await report.destroy();

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting report", error: error.message });
  }
});
