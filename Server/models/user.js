const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    user_type: Number, //type 1 = admin , type = 2 user(for check permission)
    email: String,
    password: String,
    personal_id: Number,
    phone: String,
    address: String,
    province: String,
    postal_code: Number,
    country: String,
},
{timestamps: true, versionKey: false})

const UserModel = mongoose.model('User',userSchema);

module.exports = UserModel