//===============================================
// Require npm packages
//===============================================

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

// Require all models
const db = require("./models");

// Initialize Express
const app = express();

// Define the port
const PORT = 3000

// If deployed, use the deployed database. Otherwise use the local  database
// let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/CheerioScraperDB";

// mongoose.connect(MONGODB_URI);

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/CheerioScraperDB", { useNewUrlParser: true });

//=================================================
// Scrape with axios 
//=================================================

axios.get("Scarpe this site URL here").then(function(response) {

    // Load the HTML into cheerio and save it to a variable
    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var results = [];

    // Scrape each element defined below 
    $("EXAMPLE:p.title").each(function(i, element) {

        // save specifics of elements grabbed here to variables

        // Save the results into an object and push to array
        results.push({
            //object goes here
        });
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);

});


//==================================================
// Routes
//==================================================

// Routes go here

//==================================================
// Start the server
//==================================================

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });