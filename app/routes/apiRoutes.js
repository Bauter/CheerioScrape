//===============================================
// Require npm packages
//===============================================

const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
let db = require("../models");

// Define Routes in exported function
module.exports = function(app) {
    
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~ Scrape for articles with axios (should be in route?)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    app.get("/scrapeForArticles", function(req, res) {

        // Scrape the "technology" page from nytimes. (best of 3 sites for consistency and no mismatched format)
        axios.get("https://www.nytimes.com/section/technology").then(function(response) {

            // Load the HTML into cheerio and save it to a variable
            const $ = cheerio.load(response.data);

            // An empty array to save the data that we'll scrape
            let results = {};

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
        db.Article.find(
            { isSaved: false}
            ).then(function(articlesFound) {
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
        }).catch(function(error) {
            console.log(error);
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
            {_id:req.params.id}
        ).then(function(response) {
            res.json(response);
        }).catch(function(error) {
            console.log(error);
        });
    }); // END OF "/save/:id"

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~ Route to get article's comments
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    app.get("/getComments/:id", function(req, res) {
        db.Article.find(
            {_id:req.params.id }
        ).then(function(responseArticle) {
            res.json(responseArticle);
        }).catch(function(error) {
            console.log(error);
        });
    }); // END OF "/save/:id"

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~ Route to update article's comments
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    app.put("/postCommentToArticle/:id", function(req, res) {
        let body = req.body.commentBody
        
        console.log(body)
        console.log(req.params.id)

        db.Comment.create(
            {body: body},
        ).then(function(commentResponse) {
            return db.Article.findOneAndUpdate({_id:req.params.id}, {$push: {comments: commentResponse._id}})
        }).then(function(articleCommentAddedResponse) {
            res.json(articleCommentAddedResponse);
        }).catch(function(error) {
            console.log(error);
        });


    }); // END OF "/postCommentToArticle/:id"

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~ Match article comment id's and find those comments to return and display
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    app.get("/matchCommentsToId/:commentId", function(req, res) {
        db.Comment.findById(
            {_id:req.params.commentId}
        ).then(function(returnMatchedComment) {
            console.log(returnMatchedComment)
            res.json(returnMatchedComment);
        }).catch(function(error) {
            console.log(error);
        });

    }); // END OF "/matchCommentsToId/:commentId"

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~ Delete comment from DB
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    app.put("/deleteComment/:id", function(req, res) {
        let id =req.params.id
        console.log(id)

        db.Comment.findByIdAndDelete(
            {_id:id}
            
        ).then(function(deleteCommentResponse) {
            return db.Article.findOneAndUpdate({comments: id}, {$pull: {comments: id}})
            
        }).catch(function(error) {
            console.log(error);
        });

    }) // END OF "/deleteComment/:id"

}; // END OF exported module
    

