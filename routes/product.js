const express = require('express')
const Product = require('../models/product')
const Mongoose = require('mongoose')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const validateProduct = require('./middleware/validateProduct');

const ProductRouter = express.Router()

app.get('/products', catchAsync(async(req, res) => {
    const {category} = req.query;
    if (category) {
        const products = await Product.findById({category});
        res.render('products/index', {products})
    } else {
        const products = await Product.find({});
        res.render('products/index', {products})
    }
}))

app.get('/products/new', (req, res) => {
    res.render('products/new')
})

app.post('/products', validateProduct, catchAsync(async (req,res) => {
    const product = new Product(req.body.product)
    await product.save()
    res.redirect(`products/${newProduct._id}`)
}))

app.get('/products/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('/products/show', {product})
}))

app.get('/products/:id/edit', catchAsync(async (req,res) => {
    const {id} = req.params.id;
    const product = await Product.findById(id);
    res.render('products/edit', {product})
}))

app.put('/products/:id', validateProduct, catchAsync(async(req, res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    res.redirect(`/products/${product._id}`)
}))

app.delete('/products/:id', catchAsync(async (req,res) => {
    const {id} = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products')
}))