import { asyncHandler } from "../../utils/errorHandling.js";
import Task from "../../database/models/Task.model.js";
import User from "../../database/models/User.model.js";
import Report from "../../database/models/Report.model.js";

export const allTasks = asyncHandler(async (req, res) => {
  try {
    const getTasks = await Task.findAll({
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "name", "department"],
        },
        {
          model: Report,
          as: "taskReports",
          attributes: ["id", "file", "createdAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, count: getTasks.length, getTasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
});

export const aSignTask = asyncHandler(async (req, res) => {
  try {
    const { aSignTo, title, description, status } = req.body;

    if (!aSignTo || !title || !description) {
      return res.status(400).json({ message: "fields is required" });
    }

    const checkEmployee = await User.findByPk(aSignTo);
    if (!checkEmployee) {
      return res.status(404).json({ message: "employee not found" });
    }

    const task = await Task.create({
      aSignTo,
      title,
      description,
      status,
    });

    res.status(201).json({ message: "Task Created Successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
  }
});

export const updateTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, aSignTo } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (aSignTo) {
      const checkUser = await User.findByPk(aSignTo);
      if (!checkUser) {
        return res.status(404).json({ message: "Assigned user not found" });
      }
      task.aSignTo = aSignTo;
    }

    await task.save();
    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
});

export const getTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.findAll({
      where: { aSignTo: userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "name", "department"],
        },
      ],
    });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

export const deleteTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.destroy();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});
