import { Joi, schema } from "express-validation";
export const list:schema = {
    query: Joi.object({
        sort: Joi.string().default(''),
        page: Joi.string().default('1'),
        pageSize: Joi.string().default('10')
    })
}