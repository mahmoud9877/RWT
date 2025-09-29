import Joi from "joi";

export const generalFields = {
  id: Joi.string().uuid().required(),
  file: Joi.any(),
};

export const aSignTaskSchema = Joi.object({
  aSignTo: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().valid("pending", "in_progress", "done").optional(),
});

export const updateTaskSchema = Joi.object({
  aSignTo: Joi.string().required(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  status: Joi.string().valid("pending", "in_progress", "done").optional(),
});
