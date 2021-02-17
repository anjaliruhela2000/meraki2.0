const express = require('express')
const Product = require('../models/product')
const Buyer = require('../models/buyer')
const Seller = require('../models/seller')
const {BuyerAuth, isLoggedIn} = require('../middleware/Buyerauth')
const Transaction = require('../models/transaction')
const passport = require('passport');
const Mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const router = express.Router()

router.get('/buyer/register', (req, res) => {
    res.render('users/register');
})

router.post('/buyer/register', catchAsync(async (req, res) => {
    try{
        const {email, username, password} = req.body;
        const buyer = new Buyer({email, username});
        const registeredBuyer = await Buyer.register(buyer, password);
        req.flash('success', 'created Buyer id');
        res.redirect('/products');
    } catch(e) {
        req.flash('error', 'e.message');
        res.redirect('/buyer/register');
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: true}), (req, res) => {
    req.flash('success', 'Welcome Back');
    res.redirect('/products');
})

router.post('/buyer/logout', BuyerAuth, catchAsync(async (req, res) => {
    req.buyer.tokens = req.buyer.tokens.filter((token) => token.token != req.token)
    await req.buyer.save()
    req.flash('success', 'Successfully logged out');
    res.redirect('/');
}))

router.post('/buyer/buy/:id', BuyerAuth, catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) throw new ExpressError(`cannot find product with given id: ${req.params.id}`, 400);

    const isTransacted = await Transaction.findOne({product_id: req.params.id})
    if (isTransacted) throw new ExpressError(`cannot find purchase with given id: ${req.params.id}`, 400);

    const seller = await Seller.findById(product.owner)
    const transaction = new Transaction({
        seller_id: product.owner,
        buyer_id: Mongoose.Schema.Types.ObjectId(req.buyer._id),
        product_id: Mongoose.Schema.Types.ObjectId(product._id)
    })
    await transaction.save()
    await product.remove()
    req.flash()
    res.status(200).send({
        message: "transaction complete",
        details: {
            buyer: req.buyer.name,
            seller: seller.name,
            price: product.price
        },
        transaction
    })
}))

module.exports = router