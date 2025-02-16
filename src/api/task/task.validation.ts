import { Joi, schema } from "express-validation";

export const listTask:schema = {
    query: Joi.object({
        title: Joi.string(),
        status: Joi.string(),
        page: Joi.string().default('1'),
        pageSize: Joi.string().default('10')
    })
}

export const createTask:schema = {
    body: Joi.object({
        title: Joi.string().required(),
        content: Joi.string(),
        status: Joi.string(),
        userId: Joi.string()
    })
}

export const editTask:schema = {
    body: Joi.object({
        title: Joi.string(),
        content: Joi.string(),
        status: Joi.string(),
        userId: Joi.string()
    })
}

