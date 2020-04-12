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
                     `<div class="box m-4">
                     <img class="m-2" style="width:30%" src="${data[i].img}">
                     <h5 class="title m-2" id="title">${data[i].title}</h5>
                     <p class="text m-2" id="summary">${data[i].summary}</p>
                     <a class="btn btn-primary m-2 linkBtn" href="https://nytimes.com${data[i].URL}">Read the article</a>
                     <button class="btn btn-primary m-2 viewComments" data-id="${data[i]._id}" data-toggle="modal" data-target="#commentModal">View Article Comments</button>
                     <button class="btn btn-primary m-2 delete" data-id="${data[i]._id}" data-toggle="modal" data-target="#deleteModal">Delete article</button>
                     </div>`
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
                            `<li class="commentListItem">${matchedCommentResponse.body}</li>
                            <br>`
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
    });

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
            $("#noCommentsDiv").empty();

            // Clear out listed comments to avoid stacking
            $("#listOfComments").empty();

            // Clear out button to avoid duplicates
            $("#commentButtonAppendHere").empty();

            // Save values to variables
            
            let commentBody = $("#commentBody").val()

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
        $("#listOfComments").empty()
    })

}); // END OF "document.ready()".