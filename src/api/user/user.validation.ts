import { Joi, schema } from "express-validation";

const emailValidation = Joi.string().email({ minDomainSegments: 2 }).required().messages({
    'string.email': 'Invalid email format',
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is required',
  })
export const create: schema = {
    body: Joi.object({
        name: Joi.string().required(),
        email: emailValidation,
        password: Joi.string().required(),
    }),
};

export const signIn: schema = {
    body: Joi.object({
        email: emailValidation,
        password: Joi.string().required(),
    }),
};

export const forgotPassword:schema = {
    body: Joi.object({
        email: emailValidation
    })
}