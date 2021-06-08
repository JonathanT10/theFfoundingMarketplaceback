const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const patronSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2, maxlenght: 50 },
    email: { type: String, required: true, minlength: 5, maxlength: 255 },
    password: { type: String, required: true, minlength: 5, maxlength: 1024 },
    cart: { type: [String]},
    pastOrders: {type: [String]},
});

patronSchema.methods.generateAuthToken = function (){
    return jwt.sign({ _id: this._id, name: this.name } , config.get('jwtSecret'));
};

const Patron = mongoose.model('Patron', patronSchema);;


function validatePatron(patron) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(1024).required(),
    });
    return schema.validate(patron);
}


exports.Patron = Patron;
exports.validate = validatePatron;