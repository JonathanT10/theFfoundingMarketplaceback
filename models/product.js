const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2, maxlenght: 150 },
    description: { type: String, required: true, minlength: 5, maxlength:  1255 },
    addressMade: { type: String, required: true, minlength: 5, maxlength: 1024 },
    price: { type: String, required: true, minlength: 2},
    merchantId: { type: String, required: true },
    img: { data: Buffer, contentType: String },
    comment: { type: [String], default: [] },
    reply: { type: [String], default: [] },
    lat: { type: String },
    lng: { type: String },
    merchName: { type: String, required: true },
    category: { type: String },
});


const Product = mongoose.model('Product', productSchema);;

exports.Product = Product;
