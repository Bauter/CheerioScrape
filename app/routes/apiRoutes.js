//===============================================
// Require npm packages
//===============================================

// Require all models
let db = require("../models");

module.exports = function(app) {
    
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~ Scrape for articles with axios (should be in route?)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    app.get("/scrapeForArticles", function(req, res) {

        // Scrape the "technology" page from nytimes. (best of 3 sites for consistency and no mismatched format)
        axios.get("https://www.nytimes.com/section/technology").then(function(response) {

            // Load the HTML into cheerio and save it to a variable
            var $ = cheerio.load(response.data);

            // An empty array to save the data that we'll scrape
            var results = {};

            // Scrape each element defined below 
            $(".css-ye6x8s").each(function(i, element) {

                // save specifics of elements grabbed here to variables
                let img = $(element).children().find("img").attr("src");
        
                let title = $(element).find("h2").text();

                let URL = $(element).find("a").attr("href");

                let summary = $(element).find("p").text();
                // Save the results into an object and push to array
                results = {
                    //object goes here
                    img: img,
                    title: title,
                    URL: URL,
                    summary: summary
                }; // END OF ".push()"

                // Create a new Article
                db.Article.create(results).then(function(dbArticle) {
                    console.log(dbArticle);
                }).catch(function(error) {
                    console.log(error);
                });

            }); // END OF ".each()".

            // Log the results once you've looped through each of the elements found with cheerio
            console.log(results);
            res.send("Scrape Complete");

        }); // END OF axios.

    }); // END OF "/scrape" route.

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~ Route to get all scraped articles in Database
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    app.get("/articlesScraped", function(req, res) {
        db.Article.find({}).then(function(articlesFound) {
            // If articles found in DB, return
            res.json(articlesFound)
        }).catch(function(error) {
            // If an error occurs, send it to the user
            res.json(error);
        })

    }); // END OF "/articlesScraped".

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~ Route to get all scraped articles from Database with comments
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    app.get("/articlesWithComments", function(req, res) {
        db.Article.find({})
            .populate("comments")
            .then(function(populatedResponse) {
                res.json(populatedResponse);

            }).catch(function(error) {
                res.json(error);

            });
    }); // END OF "/articlesWithComments".

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~ Route to update articles to save
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    app.put("/save/:id", function(req, res) {
        db.Article.findByIdAndUpdate(
            {_id: req.params.id },
            {$set: { isSaved: true }}
        ).then(function(response) {
            res.json(response);
        });
    }); // END OF "/save/:id"


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~ Route to get all saved articles from Database
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    app.get("/articlesSetToSave", function(req, res) {
        db.Article.find(
            { isSaved: true}
            ).then(function(savedResponse) {
                res.json(savedResponse);

            }).catch(function(error) {
                res.json(error);
            });
    }); // END OF "/articlesSetToSave".

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~ Route to update articles to save
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    app.put("/delete/:id", function(req, res) {
        db.Article.findByIdAndDelete(
            {_id: req.params.id }
        ).then(function(response) {
            res.json(response);
        });
    }); // END OF "/save/:id"




}; // END OF "module"
    

