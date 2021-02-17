const Joi = require('joi');

module.exports.productSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        category: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})