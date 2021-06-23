const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const { highlightSchema } = require('./higlight');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2, maxlenght: 50 },
    email: { type: String, required: true, minlength: 5, maxlength: 255 },
    password: { type: String, required: true, minlength: 5, maxlength: 1024 },
    highUS: { type: [highlightSchema], default: [] },
    highVet: { type: [highlightSchema], default: [] },
    highFire: { type: [highlightSchema], default: [] },
    highPol: { type: [highlightSchema], default: [] },
    isAdmin: { type: Boolean, default: true}
});

adminSchema.methods.generateAuthToken = function (){
    return jwt.sign({ _id: this._id, name: this.name, isAdmin: this.isAdmin } , config.get('jwtSecret'));
};

const Admin = mongoose.model('Admin', adminSchema);;


function validateAdmin(admin) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(1024).required()
    });
    return schema.validate(admin);
}


exports.Admin = Admin;
exports.validate = validateAdmin;