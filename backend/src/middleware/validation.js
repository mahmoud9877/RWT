import joi from "joi";

export const generalFields = {
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 4,
      tlds: { allow: ["com", "net"] },
    })
    .messages({
      "string.email": "Invalid email format",
    }),

  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, one uppercase, one lowercase, and one number",
    }),

  id: joi.number().integer().positive().messages({
    "number.base": "ID must be a number",
    "number.integer": "ID must be an integer",
    "number.positive": "ID must be positive",
  }),

  file: joi
    .object({
      size: joi.number().positive().required(),
      originalname: joi.string().required(),
      mimetype: joi.string().required(),
      fieldname: joi.string().required(),
      path: joi.string().optional(),
      filename: joi.string().optional(),
      destination: joi.string().optional(),
      encoding: joi.string().optional(),
    })
    .unknown(true)
    .optional(),
};

export const validation = (schema, source = ["body", "params", "query", "file"]) => {
  return (req, res, next) => {
    // دمج الـ inputs من أماكن مختلفة
    const inputsData = source.reduce((acc, key) => {
      if (key === "file" && req.file) {
        acc.file = req.file;
      } else if (req[key]) {
        acc = { ...acc, ...req[key] };
      }
      return acc;
    }, {});

    // التحقق
    const validationResult = schema.validate(inputsData, {
      abortEarly: false, // يعرض كل الأخطاء مش أول واحد بس
      allowUnknown: true,
    });

    if (validationResult.error) {
      return res.status(400).json({
        message: "Validation Error",
        details: validationResult.error.details.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    return next();
  };
};
