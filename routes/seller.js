const express = require('express')
const Seller = require('../models/seller')
const Auth = require('../middleware/Buyerauth')
const Product = require('../models/product')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const router = express.Router()


router.post('/seller/register', catchAsync(async(req, res) => {
    const seller = new Seller(req.body)
    const token = await seller.getAuthtoken()
    await seller.save()
    req.flash('success', 'Successfully created seller id')
    res.redirect('/products')
}))

router.get('/seller/me', Auth, catchAsync(async(req, res) => {
    const seller = req.seller
    if (!seller) throw new ExpressError("not found", 400)
    res.status(200).send(seller)
}))

router.patch('/seller/me', Auth, catchAsync(async(req, res) => {
    const to_update = Object.keys(req.body)
    const valid_keys = ['name', 'email', 'password']
    const is_valid = to_update.every((update) => valid_keys.includes(update))
    if (!is_valid) throw new ExpressError("Unable to update", 400)
    const seller = req.seller
    to_update.forEach(update => seller[update] = req.body[update])
    await seller.save()
    if (!seller) throw new ExpressError("Unable to update", 400)
    res.status(200).send(seller)
}))

router.post('/seller/login', catchAsync(async(req, res) => {
    const seller = await Seller.findByCredentials(req.body.email, req.body.password)
    const token = await seller.getAuthtoken()
    res.status(200).send({ seller, token })
}))

router.post('/seller/logout', Auth, catchAsync(async(req, res) => {
    req.seller.tokens = req.seller.tokens.filter((token) => token.token != req.token)
    await req.seller.save()
    req.flash('success', "Successfully logged out");
    res.redirect('/');
}))

router.post('/seller/product/add', Auth, async(req, res) => {
    const product = new Product({...req.body,
        owner: req.seller._id
    })
    product.clicks = 0
    await product.save()
    req.flash('success', 'Successfully added product')
    res.redirect(`/seller/product/${product._id}`)
})

router.patch('/seller/product/:id', Auth, catchAsync(async(req, res) => {
    const updates = Object.keys(req.body)
    const validkeys = ['item_name', 'description', 'category', 'price']
    const validrequest = updates.every((update) => validkeys.includes(update))
    if (!validrequest) return res.status(400).send({ error: "bad request" })
    const product = await Product.findOne({ _id: req.params.id, owner: req.seller._id })
    updates.forEach(update => product[update] = req.body[update])
    await product.save()
    if (!product) throw new ExpressError("not found", 400)
    res.status(200).send({ product })
}))

router.delete('/seller/product/:id', Auth, catchAsync(async(req, res) => {
    const product = await Product.deleteOne({ _id: req.params.id, owner: req.seller._id })
    if (!product) throw new ExpressError("not found", 400)
    req.flash('success', 'Successfully deleted product')
    res.redirect('/products')
}))

module.exports = router