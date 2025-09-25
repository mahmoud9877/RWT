import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  password: generalFields.password.required(),
});


export const loginSchema = Joi.object({
  apiKey: Joi.string().min(3).max(100).required()
}).required().unknown(false);