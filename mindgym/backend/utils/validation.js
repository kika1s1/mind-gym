import Joi from 'joi';

export const validateRegister = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.alphanum': 'Username must contain only letters and numbers',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long'
      }),
    firstName: Joi.string()
      .min(1)
      .max(50)
      .optional(),
    lastName: Joi.string()
      .min(1)
      .max(50)
      .optional()
  });

  return schema.validate(data);
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  });

  return schema.validate(data);
};

export const validateProblem = (data) => {
  const schema = Joi.object({
    title: Joi.string()
      .min(1)
      .max(200)
      .required(),
    description: Joi.string()
      .min(1)
      .required(),
    difficulty: Joi.string()
      .valid('Easy', 'Medium', 'Hard')
      .required(),
    category: Joi.string()
      .required(),
    tags: Joi.array()
      .items(Joi.string())
      .optional(),
    inputFormat: Joi.string()
      .required(),
    outputFormat: Joi.string()
      .required(),
    constraints: Joi.string()
      .required(),
    samples: Joi.array()
      .items(Joi.object({
        input: Joi.string().required(),
        output: Joi.string().required(),
        explanation: Joi.string().optional()
      }))
      .min(1)
      .required(),
    testCases: Joi.array()
      .items(Joi.object({
        input: Joi.string().required(),
        output: Joi.string().required(),
        isHidden: Joi.boolean().optional()
      }))
      .min(1)
      .required(),
    starterCode: Joi.string()
      .optional(),
    solution: Joi.string()
      .optional(),
    hints: Joi.array()
      .items(Joi.string())
      .optional(),
    timeLimit: Joi.number()
      .positive()
      .optional(),
    memoryLimit: Joi.number()
      .positive()
      .optional()
  });

  return schema.validate(data);
};

export const validateSubmission = (data) => {
  const schema = Joi.object({
    problemId: Joi.string()
      .required()
      .messages({
        'any.required': 'Problem ID is required'
      }),
    userCode: Joi.string()
      .required()
      .messages({
        'any.required': 'Code is required'
      }),
    language: Joi.string()
      .valid('python')
      .default('python')
  });

  return schema.validate(data);
};