import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
});


export const loginSchema = Joi.object({
  apiKey: Joi.string().min(3).max(100).required()
}).required().unknown(false);