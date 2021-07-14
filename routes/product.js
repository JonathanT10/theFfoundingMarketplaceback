const { Product } = require('../models/product');
 const express = require('express');
 const router = express.Router();
 const multer = require('multer');

 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null,false);
    }
}

const upload = multer({
   storage: storage,
   limits: {
       fileSize: 1024 * 1024 * 5
   },
   fileFilter: fileFilter
});



//get a product from ID
router.get('/', async (req, res) => {
    try{
         const product = await Product.find();

         if (!product)
         return res.status(400).send(`The product with ID: ${req.params.id} does not exist`);
         return res.send(product);
    }catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//get a product from ID
router.get('/:id', async (req, res) => {
    try{
         const product = await Product.findById(req.params.id);

         if (!product)
         return res.status(400).send(`The product with ID: ${req.params.id} does not exist`);
         return res.send(product);
    }catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

router.get('/:id/merchant',  async (req, res) => {
    try{

        const product = await Product.find({merchantId: req.params.id});

        if(!product)
        return res.status(400).send(`The merchant with id ${req.params.id} does not exist.`);
        return res.send(product);
    }catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});



//create new product
 router.post('/', async (req, res) => {
     try{
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            addressMade: req.body.addressMade,
            price: req.body.price,
            merchantId: req.body.merchantId,
            merchName: req.body.merchName
        });

        await product.save();

        return res.send(product);
     } catch (ex) {
         return res.status(550).send(`Internal Server Error: ${ex}`);
     }
 })

 //add comment to product
 router.put('/:id', async (req, res) => {
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                comment: [req.body.comment]
            },
            { new: true }
        );

        if (!product)
        return res.status(400).send(`The product with ID: ${req.params.id} does not exist`);

        await product.save();

        return res.send(product);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
 });
  //add reply to comment to product
  router.put('/:id/reply', async (req, res) => {
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                reply: [req.body.reply]
            },
            { new: true }
        );

        if (!product)
        return res.status(400).send(`The product with ID: ${req.params.id} does not exist`);

        await product.save();

        return res.send(product);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
 });


// upload a profile image
router.put("/uploadmulter/:id", upload.single('img'), async (req, res) => {
    try{
     const product = await Product.findByIdAndUpdate(req.params.id, {img: req.file.path});
     if (!product)
     return res.status(400).send(`The product with ID: ${req.params.id} does not exist`);
 
     console.log(product);
 
     await product.save();
     return res.send(product);
 } catch (ex) {
     return res.status(500).send(`Internal Server Error: ${ex}`);
 }
 });




 router.put('/:id/map', async (req, res) => {
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                lat: req.body.lat,
                lng: req.body.lat
            },
            { new: true }
        );

        if (!product)
        return res.status(400).send(`The product with ID: ${req.params.id} does not exist`);

        await product.save();

        return res.send(product);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
 });

 
 router.put('/:id/name', async (req, res) => {
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                merchName: req.body.merchName
            },
            { new: true }
        );

        if (!product)
        return res.status(400).send(`The product with ID: ${req.params.id} does not exist`);

        await product.save();

        return res.send(product);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
 });


 module.exports = router;