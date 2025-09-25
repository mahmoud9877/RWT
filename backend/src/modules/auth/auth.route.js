import express from "express";
import { signup, login } from "./auth.controller.js";
import { loginSchema, registerSchema } from './auth.validation.js'
import { validation } from "../../middleware/validation.js";

const router = express.Router();

router.post("/signup",
    validation(registerSchema),
    signup);
router.post("/login",
    validation(loginSchema),
    login);

export default router;
