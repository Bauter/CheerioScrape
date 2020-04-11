// front end code goes here


$(document).ready(function() {

    console.log("js connected");

        // Function to display the DB collection "Article" when page loads.
        const appendArticles = function() {

            $.ajax({
                method: "GET",
                url: "/articlesScraped"
            }).then(function(data) {
                console.log(data)
                // For each one
                for (var i = 0; i < data.length; i++) {
                    
                    if (data[i].isSaved === true) {
                        i++;
                    }

                    // An attempt to avoid displaying duplicate data
                    //data[i].isDisplayed = true
                    // console.log(data[i].isDisplayed)

                    // if (data[i].isDisplayed === true) {
                    //     i++
                    // }

                    // Append the data to the page   
                    $("#articles").append(
                         `<div class="box m-4">
                         <img class="m-2" style="width:30%" src="${data[i].img}">
                         <h5 class="title m-2" id="title">${data[i].title}</h5>
                         <p class="text m-2 " id="summary">${data[i].summary}</p>
                         <a class="btn btn-primary m-2 linkBtn" href="https://nytimes.com${data[i].URL}">Read the article</a>
                         <button class="btn btn-primary m-2 save" data-id="${data[i]._id}" data-toggle="modal" data-target="#saveModal">Save article</button>
                         </div>`

                    );
                }  
                 
            });

        }; // END OF appendArticles() function
        
        // Call function to display articles
        appendArticles();


        // Save button event listener
        $(document).on("click",".save", function() {
            console.log("clicked");

            $("#noSaved").remove()
            // Assign id to data-id to select proper article from DB
            const id = $(this).attr("data-id");

            // Remove this Div once save button is clicked
            $(this).parent().remove()
            //Ajax call to update DB in back end
            $.ajax({
                method:"PUT",
                url: "/save/" + id
            }).then(function(setSaveResponse) {
                // Confirm save with 2 logs
                console.log(setSaveResponse)
                console.log("Saved article!")
            });
        }); // END OF ".save" button EL.

}); // END OF "documnet.ready()".
