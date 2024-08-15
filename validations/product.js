const Joi = require('joi');

const productValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    image: Joi.array().required(),
    price: Joi.number().required(),
    // count: Joi.number().required(),
})

module.exports = productValidator