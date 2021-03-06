$(document).ready(function() {

    console.log("js connected");

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Function to display the DB collection "Article" when page loads.
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                    `
                    <div class="card mb-6" >
                        <div class="row no-gutters">
                            <div  id="clear" class="col-xl-6">
                                <img class="m-4" src="${data[i].img}">
                            </div>
                            <div class="col-xl-6">
                                <div class="card-body">
                                    <h5 class="card-title m-2" id="title"><a href="https://nytimes.com${data[i].URL}" title="Read Article!">${data[i].title}</a></h5>
                                    <p class="card-text m-2" id="summary">${data[i].summary}</p>
                                <button class="btn-group btn-primary m-2 viewComments" data-id="${data[i]._id}" data-toggle="modal" data-target="#commentModal">Comments</button>
                                <button class="btn-group btn-danger m-2 delete" data-id="${data[i]._id}" data-toggle="modal" data-target="#deleteModal">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                );
            }  
             
        });

    }; // END OF "appendSavedArticles()".

    //=========================================
    // Call function to display saved articles.
    //=========================================

    appendSavedArticles();

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Delete button event listener
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
            // Confirm delete with 2 logs
            console.log(deleteResponse);
            console.log("Deleted article!");
        });


    }); // END OF ".delete" button EL.

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
    // closeDeleteModal EL
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    $(document).on("click", ".closeDeleteModal", function() {
        
        location.reload()

    }) // END OF ".closeDeleteModal" EL


}); // END OF "document.ready()".