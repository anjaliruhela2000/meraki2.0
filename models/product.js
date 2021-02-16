const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        reqired: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['fruit', 'vegetable', 'dairy', 'bakery', 'clothing', 'miscellaneous'],
        lowercase: true,
        required: true,
    },
    price: {
        type: String,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        // required: true,
        ref: 'seller'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('product', ProductSchema);