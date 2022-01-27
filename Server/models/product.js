const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    product_code : String,
    product_desc : String,
    product_status : Number, // 0 = ยังไม่เริ่มการประมูล, 1 = อยู่ในช่วงประมูล, 2 = ประมูลสิ้นสุดแล้ว
    product_active : String, // A = Active , U = Unactive
    product_details : String,
    name: String,
    qty: Number,
    price: Number,
    bid: Number,
    currency: String
},
{timestamps: true, versionKey: false})

const ProductModel = mongoose.model('Product',productSchema);

module.exports = ProductModel