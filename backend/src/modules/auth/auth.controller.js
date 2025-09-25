import { nanoid } from "nanoid";
import userModel from "../../database/models/User.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

// Signup
export const signup = asyncHandler(async (req, res) => {
    const { password, name } = req.body;
    const normalizedEmail = name.toLowerCase().trim();
    const existingUser = await userModel.findOne({ where: { name: normalizedEmail } });
    if (existingUser) return res.status(409).json({ message: "User already exists" });
    const hashedPassword = await bcryptjs.hash(password, 8);
    const newUser = await userModel.create({
        name,
        password: hashedPassword,
        apiKey: nanoid(),
        role: 'admin'
    });
    res.status(201).json({
        message: "Signup successful",
        user: { id: newUser.id, apiKey: newUser.apiKey, name: newUser.name }
    });
});

// Login
export const login = asyncHandler(async (req, res) => {
    try {
        const { apiKey } = req.body;
        if (!apiKey) return res.status(400).json({ message: "apiKey required" });
        const user = await userModel.findOne({
            where: { apiKey: apiKey },
        });
        if (!user) return res.status(404).json({ message: "apiKey not found" });
        const payload = {
            id: user.id,
            role: user.role,
            apiKey: user.apiKey
        };
        const createToken = jwt.sign(payload, process.env.TOKEN_SIGNATURE, { expiresIn: '7d' })
        res.status(200).json({ message: "Login successful", token: createToken, apiKey });
    } catch (error) {
        return res.json({ message: 'error', error })
    }
});


