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
        
    //=========================================
    // Call function to display unsaved articles.
    //=========================================

    appendArticles();

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Save button event listener
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    $(document).on("click",".save", function() {
        console.log("clicked");

        // Assign id to data-id to select proper article from DB
        const id = $(this).attr("data-id");

        // Remove this Div once save button is clicked
        //$(this).find($(this).parent(".row")).remove()
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

        // Had to refresh, parent div won't remove
        //location.reload();

    }); // END OF ".save" button EL.

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Function to display comments when button is clicked 
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const showComments = function(id){
        console.log("getting ready to show comments")
        $.ajax({
            method:"GET",
            url: "/getComments/" + id
        }).then(function(commentResponse) {
            console.log(commentResponse[0].comments);

            // Check to see if this article has any comments
            if (commentResponse[0].comments.length <= 0) {
                
                $("#noCommentsDiv").append(`
                <p>No comments at this time</p>
                <br>
                <button id="leaveComment" class="btn btn-primary" data-id="${id}">Leave Comment</button>`)
            
            } else {
                
                for (let i=0; i< commentResponse[0].comments.length; i++) {
                    let commentId = commentResponse[0].comments[i]
                    console.log(commentId)
                    $.ajax({
                        method:"GET",
                        url: "/matchCommentsToId/"+commentId
                    }).then(function(matchedCommentResponse) {
                        console.log(matchedCommentResponse.body);

                        $("#listOfComments").append(
                            `
                            <div>
                            <li class="commentListItem mt-2">${matchedCommentResponse.body}</li>
                            <button id="deleteComment" class="close mb-2 deleteComment" data-id="${commentId}"><span class="colorRed" title="delete">X</span></button>
                            <hr class="m-4">
                            <br>
                            </div>
                            `
                        );
                    
                    });
                    
                }

                $("#commentButtonAppendHere").append(
                    `<button id="leaveComment" class="btn btn-primary" data-id="${id}">Leave Comment</button>`
                );
                
            }
        });

    }; // END OF "showComments()".

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  viewComments button event listener
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    $(document).on("click", ".viewComments", function(event) {
        event.preventDefault();
        let id = $(this).attr("data-id")
        $("#makeCommentDiv").hide();
        
        showComments(id)

    }); // END OF ".viewComments" EL

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  leaveComment button event listener
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    $(document).on("click", "#leaveComment", function() {
        $("#makeCommentDiv").show()

        let id = $(this).attr("data-id")

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //  submitComment button event listener
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        $(document).on("click", "#submitComment", function(event) {
            // Clear appended p tag from conditional statement
            $("#noCommentsDiv").remove();

            // Clear out listed comments to avoid stacking
            $("#listOfComments").empty();

            // Clear out button to avoid duplicates
            $("#commentButtonAppendHere").empty();

            // Save values to variables
            let commentBody = $("#commentBody").val();


            $.ajax({
                method:"PUT",
                url:"/postCommentToArticle/"+id,
                data: {commentBody}
            }).then(function(submitResponse) {
                console.log("comment posted!")
                console.log(submitResponse)
            })
        
        })
        
    }) // END OF "#leaveComment" EL

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // closeCommentModal button event listener
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    $(document).on("click", "#closeCommentModal", function() {
        // Clear out listed comments to avoid stacking
        location.reload()
        $("#listOfComments").empty()

        // Clear appended p tag from conditional statement
        $("#noCommentsDiv").empty();

        // Clear out button to avoid duplicates
        $("#commentButtonAppendHere").empty();

    }) // END OF "#closeCommentModal" EL

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // deleteComment button event listener
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    $(document).on("click", ".deleteComment", function() {
        
        let id = $(this).attr("data-id")
        $("#makeCommentDiv").hide();
        // Find the parent div and delete
        $(this).parent().remove();

        $.ajax({
            method:"PUT",
            url:"/deleteComment/"+id 
        }).then(function(deleteCommentResponse) {
            console.log("comment deleted!")
            console.log(deleteCommentResponse);
        })
        

    }); // END OF ".deleteComment" EL

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // saveModal EL
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    $(document).on("click", ".saveModal", function() {
        
        location.reload()

    }) // END OF ".saveModal" EL

}); // END OF "document.ready()".
