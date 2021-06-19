const { Highlight } = require('../models/higlight');
 const express = require('express');
 const router = express.Router();



//get a highlight from ID
router.get('/', async (req, res) => {
    try{
         const highlight = await Highlight.find();

         if (!highlight)
         return res.status(400).send(`The higlight with ID: ${req.params.id} does not exist`);
         return res.send(highlight);
    }catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})


//create new highlight
router.post('/', async (req, res) => {
    try{
       const highlight = new Highlight({
           request: req.body.request,
           merchantId: req.body.merchantId,
       });

       await highlight.save();

       return res.send(highlight);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

 
 module.exports = router;