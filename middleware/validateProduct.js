const Product = require('../models/product');
const express = require('express');
const {productSchema} = require('../schemas.js');

const validateProduct = (req, res, next) => {
    const {error} = productSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports = validateProduct;