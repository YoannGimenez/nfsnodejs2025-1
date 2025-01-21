var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Article = require("../model/Article");

var PresentationSchema = new Schema({
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    },
});

module.exports = mongoose.model('Presentation', PresentationSchema);