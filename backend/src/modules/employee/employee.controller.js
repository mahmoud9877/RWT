import { asyncHandler } from "../../utils/errorHandling.js";
import User from "../../database/models/User.model.js";
import { nanoid } from "nanoid";

export const getAllEveEmployee = asyncHandler(async (req, res) => {
  try {
    const allEmployee = await User.findAll({ where: { role: 'employee' } });
    return res.json({ message: "Done", allEmployee });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export const getDataEmployee = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export const getEmployeeById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await User.findOne({
      where: { id },
      attributes: ["id", "name", "department"]
    });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    const { knowledgeText, ...employeeData } = employee.toJSON();
    res.status(200).json(employeeData);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export const createEveEmployee = asyncHandler(async (req, res) => {
  try {
    const { name, department } = req.body;
    if (!name || !department) return res.status(400).json({ message: "Missing required fields" });
    const employee = await User.create({
      apiKey: nanoid(),
      name,
      department,
      role: 'employee',
    });
    res.status(201).json({ message: "Done", employee });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export const updateEveEmployee = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await User.findOne({ where: { id } });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    const { name, department, role, status } = req.body;
    if (name !== undefined) employee.name = name;
    if (department !== undefined) employee.department = department;
    if (role !== undefined) employee.role = role;
    if (status !== undefined) employee.status = status;
    await employee.save();
    const { createdAt, updatedAt, ...data } = employee.toJSON();
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const checkId = await User.findByPk(id);
    if (!checkId) {
      return res.json({ message: "User Not found" });
    }
    await checkId.destroy();
    return res.status(200).json({ message: "done" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});
