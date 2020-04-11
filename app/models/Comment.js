//===============================================
// Require npm packages
//===============================================

const mongoose = require("mongoose");

// Save a reference to the Schema constructor
let Schema = mongoose.Schema;

//===============================================
// Define model
//===============================================

let CommentSchema = new Schema({
    body: {
        type: String,
        validate : [
            function(input) {
                return input.length >= 4;
              },
              "Comment should be at least 4 characters long."
        ]
        
    },
    commentCreatedAt: {
        type: Date,
        default: Date.now()
    }

});

// This creates our model from the above schema, using mongoose's model method
let Comment = mongoose.model("Comment", CommentSchema);

// Export module
module.exports = Comment;