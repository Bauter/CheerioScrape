//===============================================
// Require npm packages
//===============================================

const express = require("express");
const mongoose = require("mongoose");

// Initialize Express
const app = express();

// Define the port
const PORT = 3000

// If deployed, use the deployed database. Otherwise use the local  database
 let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/CheerioScraperDB";

 mongoose.connect(MONGODB_URI);
 

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("./app/public"));

// Connect to the Mongo DB
//mongoose.connect("mongodb://localhost/CheerioScraperDB", { useNewUrlParser: true });

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