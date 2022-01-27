const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productBidSchema = new Schema({
    product_id : String,
    price: Number,
    bid_count: Number,
    price_min: Number,
    price_now: Number,
    start_datetime: Number, //unixtimestamp 10 bits
    end_datetime: Number, //unixtimestamp 10 bits
    run_no: Number,
},
{timestamps: true, versionKey: false})

const ProductBidModel = mongoose.model('products_bid',productBidSchema);

module.exports = ProductBidModel