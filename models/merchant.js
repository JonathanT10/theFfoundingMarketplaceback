const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const merchantSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2, maxlenght: 50 },
    email: { type: String, required: true, minlength: 5, maxlength: 255 },
    password: { type: String, required: true, minlength: 5, maxlength: 1024 },
    about: { type: String, minlength: 5, maxlength: 500 },
    category: { type: String },
    hqAddress: { type: String, minlength: 5, maxlength: 1024, required: true },
    inCountry: { type: Boolean, default: false},
    veteran: {  type: Boolean, default: false},
    fire: { type: Boolean, default: false },
    police: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false}
});

merchantSchema.methods.generateAuthToken = function (){
    return jwt.sign({ _id: this._id, name: this.name, isAdmin: this.isAdmin } , config.get('jwtSecret'));
};

const Merchant = mongoose.model('Merchant', merchantSchema);;


function validateMerchant(merchant) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(1024).required(),
        hqAddress: Joi.string().min(5).max(1024).required()
    });
    return schema.validate(merchant);
}


exports.Merchant = Merchant;
exports.validate = validateMerchant;