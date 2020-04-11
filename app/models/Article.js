//===============================================
// Require npm packages
//===============================================

const mongoose = require("mongoose");

// Save a reference to the Schema constructor
let Schema = mongoose.Schema;

//===============================================
// Define model
//===============================================

let ArticleSchema = new Schema({
    img: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    URL: {
        type:String,
        required:true,
        unique:true
    },
    summary: {
        type: String,
        required: true,
        unique:true
    },
    isSaved: {
        type: Boolean,
        default: false
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// This creates our model from the above schema, using mongoose's model method
let Article = mongoose.model("Article", ArticleSchema);

// Export module
module.exports = Article;