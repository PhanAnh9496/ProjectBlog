var mongoose = require('mongoose');

var product = new mongoose.Schema({
    titleProduct: {type: String},
    anh: {type: Array},
    Description: {type: String},
    contentProduct: {type: String}
},{collection: "post"});

module.exports = mongoose.model("posts", product);
