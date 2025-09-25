import cohere from "../../utils/chore.js";
import mammoth from "mammoth";
import fs from "fs";
import { extractTextFromPDF } from "../../utils/pdf.js";
import Report from "../../database/models/Report.model.js";
import User from "../../database/models/User.model.js";
import Task from "../../database/models/Task.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const createReport = asyncHandler(async (req, res) => {
  const { employee_id, task_id, text } = req.body;
  const file = req.file;

  const employee = await User.findByPk(employee_id);
  if (!employee) return res.status(404).json({ error: "Employee not found." });

  const task = await Task.findByPk(task_id);
  if (!task) return res.status(404).json({ error: "Task not found." });

  let finalText = text || "";

  if (file) {
    const buffer = fs.readFileSync(file.path);
    const mimeType = file.mimetype;

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

    if (!finalText || finalText.trim().length === 0) {
      console.warn("Uploaded file has no extractable text.");
    }
  }

  // لو النص النهائي فاضي، ممكن ما نرسلهوش للـ AI
  let summary = null;
  if (finalText && finalText.trim().length > 0) {
    const prompt = `
Summarize the following employee report clearly and concisely.
Use the same language as the input.
Do not add or invent any information.
Limit the summary to 5 bullet points or 5 short sentences.

Report:
${finalText}
`;
    const response = await cohere.chat({ message: prompt, temperature: 0.4 });
    summary = response?.text?.trim() || "No summary generated.";
  }

  const report = await Report.create({
    employee_id,
    task_id,
    file: file?.filename || null,
    text: finalText,
    summary,
  });

  res.status(201).json({ message: "Report created successfully", report });
});

export const getEmployeeReports = asyncHandler(async (req, res) => {
  const employee_id = req.user.id;

  const reports = await Report.findAll({
    where: { employee_id },
    include: [
      { model: Task, as: "task", attributes: ["id", "title"] },
      { model: User, as: "employee", attributes: ["id", "name", "department"] } // ✅ أضف دي
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json(reports);
});


// User.hasMany(Report, { foreignKey: "employee_id", as: "reports" });
// Report.belongsTo(User, { foreignKey: "employee_id", as: "employee" });

// Task.hasMany(Report, { foreignKey: "task_id", as: "taskReports" });
// Report.belongsTo(Task, { foreignKey: "task_id", as: "task" });


export const getReports = async (req, res) => {
  const { userId } = req.query;

  const whereClause = userId ? { employee_id: userId } : {};

  const reports = await Report.findAll({
    where: whereClause,
    include: [
      { model: User, as: "employee", attributes: ["id", "name", "department"] },
      { model: Task, as: "task", attributes: ["id", "title"] }
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json(reports);
};



// Get Single Report
export const getReportById = async (req, res) => {
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
    console.error("Error fetching report:", error.message);
    res.status(500).json({ message: "Error fetching report", error: error.message });
  }
};

// Update Report
export const updateReport = async (req, res) => {
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
    console.error("Error updating report:", error.message);
    res.status(500).json({ message: "Error updating report", error: error.message });
  }
};

// Delete Report
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await report.destroy();

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error.message);
    res.status(500).json({ message: "Error deleting report", error: error.message });
  }
};
