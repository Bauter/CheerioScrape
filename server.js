//===============================================
// Require npm packages
//===============================================

const express = require("express");
const mongoose = require("mongoose");


//================================================
// Set up express and mongoose
//================================================

// Initialize Express
const app = express();

// Define the port
const PORT = process.env.PORT || 3000;

// If deployed, use the deployed database. Otherwise use the local  database
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/CheerioScraperDB";

mongoose.connect(MONGODB_URI);
 
//mongoose.connect("mongodb://localhost/CheerioScraperDB", { useNewUrlParser: true });
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("./app/public"));

//===================================================
// Routes
//===================================================

// HTML routes
require('./app/routes/htmlRoutes')(app);

// Api routes
require('./app/routes/apiRoutes')(app);

//==================================================
// Start the server
//==================================================

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });