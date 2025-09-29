import { nanoid } from "nanoid";
import userModel from "../../database/models/User.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signup = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Name is required" });

        const normalizedName = name.toLowerCase().trim();
        const existingUser = await userModel.findOne({ where: { name: normalizedName } });
        if (existingUser) return res.status(409).json({ message: "User already exists" });

        const newUser = await userModel.create({
            name: normalizedName,
            apiKey: nanoid(),
            role: "admin",
        });

        return res.status(201).json({
            message: "Signup successful",
            user: { id: newUser.id, apiKey: newUser.apiKey, name: newUser.name },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

export const login = asyncHandler(async (req, res) => {
    try {
        const { apiKey } = req.body;
        if (!apiKey) return res.status(400).json({ message: "apiKey is required" });

        const user = await userModel.findOne({ where: { apiKey } });
        if (!user) return res.status(404).json({ message: "apiKey not found" });

        const payload = { id: user.id, role: user.role, apiKey: user.apiKey };
        const token = jwt.sign(payload, process.env.TOKEN_SIGNATURE, { expiresIn: "7d" });

        return res.status(200).json({
            message: "Login successful",
            token,
            apiKey,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
