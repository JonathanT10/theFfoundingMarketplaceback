const mongoose = require('mongoose');


const highlightSchema = new mongoose.Schema({
    request: { type: String, required: true, minlength: 2, maxlenght: 150 },
    merchantId: { type: String, required: true, minlength: 5, maxlength:  1255 },
});


const Highlight = mongoose.model('highlight', highlightSchema);;

exports.Highlight = Highlight;
