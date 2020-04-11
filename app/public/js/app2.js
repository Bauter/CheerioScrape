$(document).ready(function() {

    console.log("js connected");

    // Function to display the DB collection "Article" when page loads.
    const appendSavedArticles = function() {

        // Display the DB collection "Article" when page loads.
        $.ajax({
            method: "GET",
            url: "/articlesSetToSave"
        }).then(function(data) {
            console.log(data)
            // For each one
            for (var i = 0; i < data.length; i++) {
                // Append the data to the page   
                $("#articles").append(
                     `<div class="card m-4">
                     <img class="p-2" style="width:30%" src="${data[i].img}">
                     <h5 class="card-title pl-2" id="title">${data[i].title}</h5>
                     <p class="card-text pl-2" id="summary">${data[i].summary}</p>
                     <a class="btn btn-primary m-2" href="https://nytimes.com${data[i].URL}">Read the article</a>
                     <button class="btn btn-primary m-2 delete" data-id="${data[i]._id}">Delete article</button>
                     </div>`
                );
            }  
             
        });

    }; // END OF "appendSavedArticles()".

    // Call function to display saved articles.
    appendSavedArticles();

     // Delete button event listener
     $(document).on("click",".delete", function() {
        console.log("clicked");

        // Assign id to data-id to select proper article from DB
        const id = $(this).attr("data-id");

        // Remove this Div once delete button is clicked
        $(this).parent().remove()

        //Ajax call to update DB in back end
        $.ajax({
            method:"PUT",
            url: "/delete/" + id
        }).then(function(deleteResponse) {
            // confirm save
            console.log(deleteResponse);
            console.log("Deleted article!");
        });
    }); // END OF ".delete" button EL.



}); // END OF "document.ready()".