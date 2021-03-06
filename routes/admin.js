const { Admin } = require('../models/admin');
 const { Image } = require('../models/image');
 const { validate } = require('../models/admin')
 const bcrypt = require('bcrypt');
 const express = require('express');
 const router = express.Router();
 const multer = require('multer');
 const auth = require('../middleware/auth');
 const admin = require('../middleware/admin');
 const { Highlight } = require('../models/higlight')


//post a new admin
router.post('/',   async (req, res) => {
    try{
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message);

        let admin = await Admin.findOne({ email: req.body.email });
        if (admin) return res.status(400).send(`Admin already registered.`);

        const salt = await bcrypt.genSalt(10);
        admin = new Admin({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
        });

        await admin.save();

        const token = admin.generateAuthToken();
        
        return res
            .header('x-auth-token', token)
            .header('access-control-expose-headers', 'x-auth-token')
            .send({ _id: admin._id, name: admin.name, email: admin.email });
}catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
}
});

//get a admin from ID
router.get('/:id', async (req, res) => {
    try{
         const admin = await Admin.findById(req.params.id);
         if (!admin)
         return res.status(400).send(`The admin with ID: ${req.params.id} does not exist`);
         return res.send(admin);
    }catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//get a admin and return only a couple variables
router.get('/', async (req, res) => {
    try {
        const admin = await Admin.find()
            .select({ _id: 1, name: 1, email: 1, about: 1, category: 1, highUS: 1, highVet: 1, highFire: 1, highPol: 1,})
            return res.send(admin);
        
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
}); 

router.post('/:adminId/highus/', async (req, res) => {
    try{
        const admin = await Admin.findById(req.params.adminId);
        if(!admin) return res.status(400).send(`The admin with id "${req.params.adminId}"does not exist.`);

        const highlight = await Highlight .find();
        if(!highlight) return res.status(400).send(`The highlight with id "${req.params.highlightId}" does not exist.`);

        admin.highUS.push(highlight);
        await admin.save();
        return res.send(admin.highUS);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// empty highlight request
router.put('/:id/empty', async (req, res) => {
    try{
        const admin = await Admin.findById(req.params.id);
    if (!admin)
        return res.status(400).send(`The admin with ID: ${req.params.id} does not exist`);
        admin.highUS.splice(0,admin.highUS.length)
        await admin.save();

        return res.send(admin.highUS);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router;