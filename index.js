const connectDB = require('./startup/db');
const express = require('express');
const app = express();
const cors = require('cors')
const merchant = require('./routes/merchant');
const patron = require('./routes/patron');
const auth = require('./routes/auth');
const product = require('./routes/product');

connectDB();


app.use(express.json());
app.use(cors());
app.use('/api/merchant/', merchant);
app.use('/api/patron/', patron);
app.use('/api/auth/', auth);
app.use('/api/product/', product);
app.use('/uploads/', express.static('uploads'))


const port = process.env.PORT || 5000;
app.listen(port, () => {
 console.log(`Server started on port: ${port}`);
});


