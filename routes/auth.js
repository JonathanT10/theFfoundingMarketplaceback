const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { Patron } = require('../models/patron');
const { Merchant } = require('../models/merchant')
const router = express.Router();


router.post('/', async (req, res) => {
    try{
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let patron = await Patron.findOne({ email: req.body.email });
        if (!patron) return res.status(400).send('Invalid email or password.');

        const validPassword = await bcrypt.compare(req.body.password, patron.password);

        if (!validPassword) return res.status(400).send('Invalid email or password.')

        const token = patron.generateAuthToken();

        return res.send(token);
    }catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.post('/merchant', async (req, res) => {
    try{
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let merchant = await Merchant.findOne({ email: req.body.email });
        if (!merchant) return res.status(400).send('Invalid email or password.');

        const validPassword = await bcrypt.compare(req.body.password, merchant.password);

        if (!validPassword) return res.status(400).send('Invalid email or password.')

        const token = merchant.generateAuthToken();

        return res.send(token);
    }catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.post('/admin', async (req, res) => {
    try{
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let admin = await Admin.findOne({ email: req.body.email });
        if (!merchant) return res.status(400).send('Invalid email or password.');

        const validPassword = await bcrypt.compare(req.body.password, merchant.password);

        if (!validPassword) return res.status(400).send('Invalid email or password.')

        const token = admin.generateAuthToken();

        return res.send(token);
    }catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


function validateLogin(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(1024).required(),
    });
    return schema.validate(req);
}

module.exports = router;