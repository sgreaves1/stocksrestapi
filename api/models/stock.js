'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var StockSchema = new Schema({
    code: {
        type: String,
        required: 'code of the stock'
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number,
    },
    currency: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },


});

module.exports = mongoose.model('Stocks', StockSchema);