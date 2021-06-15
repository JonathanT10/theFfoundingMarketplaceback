const { Patron } = require('../models/patron');
const { Product } = require('../models/product');
 const { validate } = require('../models/patron');
 const bcrypt = require('bcrypt');
 const express = require('express');
 const router = express.Router();
 const auth = require('../middleware/auth');

 

//post a new patron
router.post('/', async (req, res) => {
    try{
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message);

        let patron = await Patron.findOne({ email: req.body.email });
        if (patron) return res.status(400).send(`Patron already registered.`);

        const salt = await bcrypt.genSalt(10);
        patron = new Patron({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
        });

        await patron.save();

        const token = patron.generateAuthToken();
        
        return res
            .header('x-auth-token', token)
            .header('access-control-expose-headers', 'x-auth-token')
            .send({ _id: patron._id, name: patron.name, email: patron.email });
}catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
}
});

//get a patron from ID
router.get('/:id', async (req, res) => {
    try{
         const patron = await Patron.findById(req.params.id);

         if (!patron)
         return res.status(400).send(`The patron with ID: ${req.params.id} does not exist`);
         return res.send(patron);
    }catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//get a patron and return only a couple variables
router.get('/', async (req, res) => {
    try {
        const patron = await User.find()
            .select({ _id: 1, name: 1, email: 1 })
            return res.send(patron);
        
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
}); 

// add cart to cart of a patron
router.put('/:id/cart', auth, async (req, res) => {
    try{
        const patron = await Patron.findByIdAndUpdate(
            req.params.id,
            {
                cart: [req.body.name,
                       req.body.description,
                       req.body.addressMade,
                       req.body.price,
                       req.body.merchantId
                ],
            },
            { new: true }
        );

        if (!patron)
        return res.status(400).send(`The patron with ID: ${req.params.id} does not exist`);

        await patron.save();

        return res.send(patron.cart);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.post('/:patronId/cart/:productId', async (req, res) => {
    try{
        const patron = await Patron.findById(req.params.patronId);
        if(!patron) return res.status(400).send(`The patron with id "${req.params.patronId}"does not exist.`);

        const product = await Product .findById(req.params.productId);
        if(!product) return res.status(400).send(`The product with id "${req.params.productId}" does not exist.`);

        patron.cart.push(product);
        await patron.save();
        return res.send(patron.cart);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//place to store past orders
router.put('/:id/pastorders', auth, async (req, res) => {
    try{
        const patron = await Patron.findByIdAndUpdate(
            req.params.id,
            {
                pastOrders: [req.body.pastOrders],
            },
            { new: true }
        );

        if (!patron)
        return res.status(400).send(`The patron with ID: ${req.params.id} does not exist`);

        await patron.save();

        return res.send(patron);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});




module.exports = router;

