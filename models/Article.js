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
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    Comments: [
        {
            type: String
        }
    ]
});

// This creates our model from the above schema, using mongoose's model method
let Article = mongoose.model("Article", ArticleSchema);

// Export module
module.exports = Article;