const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    seller_id: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    buyer_id: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    product_id: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true
    }
})

module.exports = mongoose.model('transaction', TransactionSchema);