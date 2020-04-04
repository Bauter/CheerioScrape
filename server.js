//===============================================
// Require npm packages
//===============================================

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/CheerioScraperDB", { useNewUrlParser: true });

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