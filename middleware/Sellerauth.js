const express = require('express')
const jwt = require('jsonwebtoken')
const Seller = require('../models/seller');

const BuyerAuth = async(req, res, next) => {
    try {
        const Authtoken = req.header("Authorization").replace("Bearer", "").trim()
        const decoded = jwt.verify(Authtoken, "seller_password")
        const seller = seller[0]
        req.token = Authtoken
        next()
    } catch(error) {
        res.status(401).send({error: "unable to authorize"})
    }
}

module.exports = BuyerAuth