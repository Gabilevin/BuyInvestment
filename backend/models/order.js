const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({

    shippingAddress: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required:true
    }],
    zip: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
    totalPrice: {
        type: Number,
    },
    country: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    },
    share: {
        type: String,
        default: 'AAPL'
    },
    purchasePrice: {
        type: Number,
        default: 0
    },
    sharePrice: {
        type: Number,
        default: 0
    },
    sharePrice2: {
    type: Number,
    default: 0
    },
    currentPrice: {
        type: Number,
        default: 0
    },
    sharesAmount: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        default: ''
    },
    time: {
        type: String,
        default: ''
    }


})

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

exports.Order = mongoose.model('Order', orderSchema);

