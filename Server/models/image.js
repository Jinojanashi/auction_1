const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    product_id : String,
    run_no : Number,
    path : String, //path S3
    picture_status : Number, // 0 = Unactive , 1 = Active
},
{timestamps: true, versionKey: false})

const ImageModel = mongoose.model('Image',ImageSchema);

module.exports = ImageModel