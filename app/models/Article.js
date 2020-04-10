//===============================================
// Require npm packages
//===============================================

const mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

//===============================================
// Define model
//===============================================

let ArticleSchema = new Schema({
    img: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    URL: {
        type:String,
        required:true
    },
    summary: {
        type: String,
        required: true
    },
    comments: [
        {
            type: String
        }
    ]
});

// This creates our model from the above schema, using mongoose's model method
let Article = mongoose.model("Article", ArticleSchema);

// Export module
module.exports = Article;