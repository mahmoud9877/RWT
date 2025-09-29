import Joi from "joi";

export const employeeIdParam = Joi.object({
  id: Joi.string().required()
});

export const createEveEmployeeSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  department: Joi.string().max(100).required(),
  role: Joi.string().max(50).optional(),
  status: Joi.string().valid("online", "away", "busy", "in meeting").optional(),
  photoUrl: Joi.string().uri().optional(),
}).unknown(false);

export const updateEveEmployeeSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  department: Joi.string().max(100).optional(),
  role: Joi.string().max(50).optional(),
  status: Joi.string().valid("online", "away", "busy", "in meeting").optional(),
  photoUrl: Joi.string().uri().optional(),
}).unknown(false);
