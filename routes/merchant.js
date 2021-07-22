const { Merchant } = require('../models/merchant');
 const { Image } = require('../models/image');
 const { validate } = require('../models/merchant')
 const bcrypt = require('bcrypt');
 const express = require('express');
 const router = express.Router();
 const multer = require('multer');
 const auth = require('../middleware/auth');
 const admin = require('../middleware/admin');

//  const storage = multer.diskStorage({
//      destination: function (req, file, cb) {
//          cb(null, './uploads/');
//      },
//      filename: function (req, file, cb) {
//          cb(null, Date.now() + file.originalname);
//      }
//  });

//  const fileFilter = (req, file, cb) => {
//      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//          cb(null, true);
//      } else {
//          cb(null,false);
//      }
//  }

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5
//     },
//     fileFilter: fileFilter
// });


//post a new merchant
router.post('/',   async (req, res) => {
    try{
        const { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message);

        let merchant = await Merchant.findOne({ email: req.body.email });
        if (merchant) return res.status(400).send(`Merchant already registered.`);

        const salt = await bcrypt.genSalt(10);
        merchant = new Merchant({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
            hqAddress: req.body.hqAddress,
        });

        await merchant.save();

        const token = merchant.generateAuthToken();
        
        return res
            .header('x-auth-token', token)
            .header('access-control-expose-headers', 'x-auth-token')
            .send({ _id: merchant._id, name: merchant.name, email: merchant.email });
}catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
}
});

//get a merchant from ID
router.get('/:id', async (req, res) => {
    try{
         const merchant = await Merchant.findById(req.params.id);

         if (!merchant)
         return res.status(400).send(`The merchant with ID: ${req.params.id} does not exist`);
         return res.send(merchant);
    }catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//get a merchant and return only a couple variables
router.get('/', async (req, res) => {
    try {
        const merchant = await Merchant.find()
            .select({ _id: 1, name: 1, email: 1, about: 1, category: 1, hqAddress: 1})
            return res.send(merchant);
        
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
}); 

// update inCountry status
router.put('/:id',  async (req, res) => {
    try{
        const merchant = await Merchant.findByIdAndUpdate(
            req.params.id,
            {
                inCountry: req.body.inCountry
            },
        );

        if (!merchant)
        return res.status(400).send(`The merchant with ID: ${req.params.id} does not exist`);

        await merchant.save();

        return res.send(merchant);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.put('/:id/vet',  async (req, res) => {
    try{
        const merchant = await Merchant.findByIdAndUpdate(
            req.params.id,
            {
                veteran: req.body.veteran
            },
        );

        if (!merchant)
        return res.status(400).send(`The merchant with ID: ${req.params.id} does not exist`);

        await merchant.save();

        return res.send(merchant);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.put('/:id/fire',  async (req, res) => {
    try{
        const merchant = await Merchant.findByIdAndUpdate(
            req.params.id,
            {
                fire: req.body.fire
            },
        );

        if (!merchant)
        return res.status(400).send(`The merchant with ID: ${req.params.id} does not exist`);

        await merchant.save();

        return res.send(merchant);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.put('/:id/police',  async (req, res) => {
    try{
        const merchant = await Merchant.findByIdAndUpdate(
            req.params.id,
            {
                police: req.body.police
            },
        );

        if (!merchant)
        return res.status(400).send(`The merchant with ID: ${req.params.id} does not exist`);

        await merchant.save();

        return res.send(merchant);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});



// update about section
router.put('/:id/about/', async (req, res) => {
    try{
        const merchant = await Merchant.findByIdAndUpdate(
            req.params.id,
            {
                about: req.body.about,
            },
        );

        if (!merchant)
        return res.status(400).send(`The merchant with ID: ${req.params.id} does not exist`);

        await merchant.save();

        return res.send(merchant);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// upload a image
// router.put("/uploadmulter/:id", upload.single('img'), async (req, res) => {
//    try{
//     const merchant = await Merchant.findByIdAndUpdate(req.params.id, {img: req.file.path});
//     if (!merchant)
//     return res.status(400).send(`The merchant with ID: ${req.params.id} does not exist`);

//     console.log(merchant);

//     await merchant.save();
//     return res.send(merchant);
// } catch (ex) {
//     return res.status(500).send(`Internal Server Error: ${ex}`);
// }
// });

module.exports = router;

