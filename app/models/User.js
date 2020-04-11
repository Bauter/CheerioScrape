//===============================================
// Require npm packages
//===============================================

const mongoose = require("mongoose");

// Save a reference to the Schema constructor
let Schema = mongoose.Schema;

//===============================================
// Define model
//===============================================

let UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    comments: [
        {
        type: Schema.Types.ObjectId,
        ref: "Comment"
        }
    ]

});

// This creates our model from the above schema, using mongoose's model method
let User = mongoose.model("User", UserSchema);

// Export module
module.exports = User;