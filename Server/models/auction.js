const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AuctionSchema = new Schema({
    product_id : String,
    user_id : String,
    product_bid_id : String,
    user_count: Number, //count users in auction
    bid_datetime : Number, //unix timestamp
    bid_status : Number, //0 = lose , 1 = win
    bid_confirm : Number // 0 = not confirm , 1 = confirm
},
{timestamps: true, versionKey: false})

const AuctionModel = mongoose.model('Auction',AuctionSchema);

module.exports = AuctionModel