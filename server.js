//===============================================
// Require npm packages
//===============================================

//const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
//const mongoose = require("mongoose");

// Require all models
//const db = require("./models");

// Initialize Express
//const app = express();

// Define the port
//const PORT = 3000

// If deployed, use the deployed database. Otherwise use the local  database
// let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/CheerioScraperDB";

// mongoose.connect(MONGODB_URI);

// Parse request body as JSON
//app.use(express.urlencoded({ extended: true }));
//app.use(express.json());
// Make public a static folder
//app.use(express.static("public"));

// Connect to the Mongo DB
//mongoose.connect("mongodb://localhost/CheerioScraperDB", { useNewUrlParser: true });

//=================================================
// Scrape with axios 
//=================================================

axios.get("https://www.nytimes.com/section/technology").then(function(response) {

    // Load the HTML into cheerio and save it to a variable
    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var results = [];

    // Scrape each element defined below 
    $(".css-ye6x8s").each(function(i, element) {

        // save specifics of elements grabbed here to variables
        let img = $(element).children().find("img").attr("src");
        
        let title = $(element).find("h2").text();

        let URL = $(element).find("a").attr("href");

        let summary = $(element).find("p").text();
        // Save the results into an object and push to array
        results.push({
            //object goes here
            img: img,
            title: title,
            URL: URL,
            summary: summary
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

// app.listen(PORT, function() {
//     console.log("App running on port " + PORT + "!");
//   });