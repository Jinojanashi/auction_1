const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Product = require('./models/product')
const ProductBid = require('./models/productBid')
const User = require('./models/user')
const Image = require('./models/image')
const Auction = require('./models/auction')
mongoose.connect('mongodb://localhost:27017/Auction',{
    useNewUrlParser: true
})

app.use(bodyParser.json())
app.use(cors());
app.use(express.static('website'))
let Count = 0;
let productID = "";
let auctionID = [""];
//products collection
//post
app.post('/products' , async (req,res) => {
    const payload = req.body
    const product = new Product(payload)
    await product.save()
    res.status(201).end()
})
//getAll
app.get('/products' , async (req,res) => {
    const product = await Product.find({})
    res.json(product)
})
//getByID
app.get('/products/:id' , async (req,res) => {
    const {id} = req.params
    const product = await Product.findById(id)
    res.json(product)
})
//update
app.put('/products/:id' , async (req,res) => {
    const payload = req.body
    const {id} = req.params
    const product = await Product.findByIdAndUpdate(id , {$set:payload})
    res.json(product)
})
//delete
app.delete('/products/:id' , async (req,res) => {
    const {id} = req.params
    await Product.findByIdAndDelete(id)
    res.status(200).end()
})
//change product_status
app.put('/products/status/:id' , async (req,res) => {
    const {id} = req.params
    const product_data = await Product.findById(id)
    const payload = product_data
    payload.product_status = req.body
    const product = await Product.findByIdAndUpdate(id , {$set:payload})
    res.json(product)
})
//change product_active
app.put('/products/active/:id' , async (req,res) => {
    const {id} = req.params
    const product_data = await Product.findById(id)
    const payload = product_data
    payload.product_active = req.body
    const product = await Product.findByIdAndUpdate(id , {$set:payload})
    res.json(product)
})

//user collection
//post
app.post('/users' , async (req,res) => {
    const payload = req.body
    payload.user_type = 2;
    const user = new User(payload)
    await user.save()
    res.status(201).end()
})
//getAll
app.get('/users' , async (req,res) => {
    const user = await User.findOne({user_type: 2})
    res.json(user)
})

//admin
//post
app.post('/admins' , async (req,res) => {
    const payload = req.body
    payload.user_type = 1;
    const user = new User(payload)
    await user.save()
    res.status(201).end()
})
//getAll
app.get('/admins' , async (req,res) => {
    const user = await User.findOne({user_type: 1})
    res.json(user)
})
//for user and admin
//getByID
app.get('/users/:id' , async (req,res) => {
    const {id} = req.params
    const user = await User.findById(id)
    res.json(user)
})
//update
app.put('/users/:id' , async (req,res) => {
    const {id} = req.params
    const payload = req.body
    const user_data = await User.findById(id)
    payload.user_type = user_data.user_type;
    payload.personal_id = user_data.personal_id
    const user = await User.findByIdAndUpdate(id , {$set:payload})
    res.json(user)
})
//delete
app.delete('/users/:id' , async (req,res) => {
    const {id} = req.params
    await User.findByIdAndDelete(id)
    res.status(200).end()
})

//image
//post use productID
app.post('/products/image/:id' , async (req,res) => {
    if(productID == "") 
    {
        productID = req.params.id.toString()
        Count++;
    }
    else if(productID != req.params.id.toString())
    {
        productID = req.params.id.toString()
        Count = 1;
    }
    else Count++;
    req.body.product_id = productID
    req.body.run_no = Count;
    const payload = req.body
    const image = new Image(payload)
    await image.save()
    res.status(201).end()
})
//delete use image id
app.delete('/image/:id' , async (req,res) => {
    const {id} = req.params
    await Image.findByIdAndDelete(id)
    res.status(200).end()
})
//delete use product id
app.delete('product/image/:id' , async (req,res) => {
    const {id} = req.params
    await Image.findOneAndDelete({product_id : id.toString()})
    res.status(200).end()
})

//product_bid collection
//post (use productId)
app.post('/productsBid/:id' , async (req,res) => {
    const {id} = req.params
    if(productID == "") 
    {
        productID = req.params.id.toString()
        Count++;
    }
    else if(productID != req.params.id.toString())
    {
        productID = req.params.id.toString()
        Count = 1;
    }
    else Count++;
    //set data
    req.body.product_id = productID
    req.body.run_no = Count;
    const payload = req.body
    const product = await Product.findById(id)
    payload.price_min = product.price
    payload.price_now = product.price + (product.bid * payload.bid_count)
    const product_bid = new ProductBid(payload)
    await product_bid.save()
    res.status(201).end()
})
// {use productBidId}
//getByID
app.get('/productsBid/:id' , async (req,res) => {
    const {id} = req.params
    const product_bid = await ProductBid.findById(id)
    res.json(product_bid)
})
//delete
app.delete('/productsBid/:id' , async (req,res) => {
    const {id} = req.params
    await ProductBid.findByIdAndDelete(id)
    res.status(200).end()
})

//auction
//post (use productNid id)
app.post('/auctions/:id' , async (req,res) => {
    const {id} = req.params
    const product_bid = await ProductBid.findById(id)
    //count user
    if(productID == "" || productID != product_bid.product_id) 
    {
        productID = product_bid.product_id
        if(auctionID.length != 0)
        {
            auctionID.length = 0;
            auctionID.push(req.body.user_id);
        }
        for(var i = 0 ; i < auctionID.length ; i++)
        {
            if(auctionID[i] != req.body.user_id)
            {
                auctionID.push(req.body.user_id);
                Count++;
            }
        }
    }
    else if(productID == product_bid.product_id)
    {
        for(var i = 0 ; i < auctionID.length ; i++)
        {
            if(auctionID[i] != req.body.user_id)
            {
                auctionID.push(req.body.user_id);
                Count++;
            }
        }
    }
    //set data
    req.body.product_id = product_bid.product_id
    req.body.product_bid_id = req.params.id.toString()
    req.body.user_count = Count;
    req.body.bid_status = 1;
    req.body.bid_confirm = 1;
    const payload = req.body
    const auction = new Auction(payload)
    await auction.save()
    res.status(201).end()
})
// {use auctions id }
//getByID 
app.get('/auctions/:id' , async (req,res) => {
    const {id} = req.params
    const product_bid = await Auction.findById(id)
    res.json(product_bid)
})
//delete
app.delete('/auctions/:id' , async (req,res) => {
    const {id} = req.params
    await Auction.findByIdAndDelete(id)
    res.status(200).end()
})
//change bid_status
app.put('/auctions/bid_status/:id' , async (req,res) => {
    const {id} = req.params
    const auction_data = await Auction.findById(id)
    const payload = auction_data
    payload.bid_status = req.body
    const auction = await Auction.findByIdAndUpdate(id , {$set:payload})
    res.json(auction)
})
//change bid_confirm
app.put('/auctions/bid_confirm/:id' , async (req,res) => {
    const {id} = req.params
    const auction_data = await Auction.findById(id)
    const payload = auction_data
    payload.bid_confirms = req.body
    const auction = await Auction.findByIdAndUpdate(id , {$set:payload})
    res.json(auction)
})

app.listen(9000 , () => {
    console.log('running on port 9000')
})