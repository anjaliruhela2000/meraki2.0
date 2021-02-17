const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BuyerAuth = require('../middleware/Buyerauth');

const Schema = mongoose.Schema;

const BuyerSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
BuyerSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('Buyer', BuyerSchema);