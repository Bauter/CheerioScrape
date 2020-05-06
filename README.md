# CheerioScrape
a web app that lets users view and leave comments on the latest news, using 'cheerio' to scrape for articles

##  Link to Live app

https://web-scraper-86.herokuapp.com/

![cheerio-app](cheerio.gif)

## What should this app do?
1. Whenever a user visits your site, the app should scrape stories from a news outlet of your choice and display them for the user. Each scraped article should be saved to your application database. At a minimum, the app should scrape and display the following information for each article:

     * Headline - the title of the article

     * Summary - a short summary of the article

     * URL - the url to the original article

     * Feel free to add more content to your database (photos, bylines, and so on).

  2. Users should also be able to leave comments on the articles displayed and revisit them later. The comments should be saved to the database as well and associated with their articles. Users should also be able to delete comments left on articles. All stored comments should be visible to every user.

## What you will need 

-explanations to follow

1. A code editor, I prefer Visual Studio Code ("https://code.visualstudio.com/").
2. Node.js to run node commands in terminal ("https://nodejs.org/en/download/").
3. '.gitignore' file to write what files you would not like to upload. 
4. NPM packages: 'axios', 'cheerio', 'express', and 'mongoose'.
5. MongoDB ("www.https://www.mongodb.com/").

## Lets get started!

- First we need an article to scrape, so... go find yourself a website with some articles!

    -example: "nytimes.com", "https://www.msn.com/en-us/news", etc

- Use the 'axios' and cheerio packages top scrape some articles in the backend and create and save them to a database.

    -example:
        ```
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

        ```

- Use Ajax on the front end to retrieve the scraped articles.

    -example:
    ```
        // Function to display the DB collection "Article" when page loads.
        const appendArticles = function() {

        $.ajax({
            method: "GET",
            url: "/articlesScraped"
        }).then(function(data) {
            console.log(data)
            // For each one
            for (var i = 0; i < data.length; i++) {
                    
                // Only render articles that are not already saved, validate this with conditional statement
                if (data[i].isSaved === true) {
                    i++;
                } else if (data[i].isSaved === false) {

                    // Append the data to the page (unsaved)  
                    $("#articles").append(
                        `<div class="card mb-6" >
                        <div class="row no-gutters bg-light">
                        <div  id="clear" class="col-xl-6">
                        <img class="m-4" src="${data[i].img}">
                        </div>
                        <div class="col-xl-6 bg-light">
                        <div class="card-body">
                        <h5 class="card-title m-2" id="title"><a href="https://nytimes.com${data[i].URL}" title="Read Article!">${data[i].title}</a></h5>
                        <p class="card-text m-2" id="summary">${data[i].summary}</p>
                        <button class="btn-group btn-primary m-2 viewComments" data-id="${data[i]._id}" data-toggle="modal" data-target="#commentModal">Comments</button>
                        <button class="btn-group btn-success m-2 save" data-id="${data[i]._id}" data-toggle="modal" data-target="#saveModal">Save</button>
                        </div>
                        </div>
                        </div>
                        </div>
                        <br>`

                    );
                }  

            }

        });

        }; // END OF appendArticles() function

    ```





