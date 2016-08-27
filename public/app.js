var articleID=-1;

$(document).on('click', $('#newArticle'), function() {
	// Article.findOne



	$('#newArticle').empty();
	$('#newArticle').append('<button id="getArticle">New Article</button>');

	$('#newArticle').on('click', function() {
	articleID++;
	$('#notes').empty();
    	


		$.getJSON('/articles', function(data) {
  // for each one
  			$('#comments').empty();
  			$('#notes').empty();
  			$('#notes').append('<textarea id="bodyinput" name="body"></textarea>'); 
		  	$('#notes').append('<button data-id="' + data[articleID]._id + '" id="savenote">Save Note</button>');
		  console.log(data[articleID]._id);
		  	$('#comments').append('<button data-id="' + data[articleID]._id + '" id="comments">See Comments</button>')
		    // display the apropos information on the page
		    $('#articles').empty().append('<h1 data-id=' + data[articleID]._id + '>' + data[articleID].title + '</h1><a href="' + data[articleID].url + '"><p>'+ data[articleID].summary + '</p>')
		});
	});
})

$(document).on('click', '#comments', function(){
	console.log(this);

	var thisId = $(this).attr('data-id');
	console.log(thisId);

	$.ajax({
		method: "GET",
		url: "/notes/" + thisId,

	}).done(function(data){
		console.log(data);
		//$('#comments').empty();
		for (var i=0; i<data.comments.length; i++) {
		$('#comments').append('<ul>' + data.body + '</ul>')
		}	
	})

})


//when you click the savenote button
$(document).on('click', '#savenote', function(){
  // grab the id associated with the article from the submit button
  console.log(this);
  var thisId = $(this).attr('data-id');

  // run a POST request to change the note, using what's entered in the inputs
  console.log(thisId);
  console.log($('#bodyinput').val())
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      body: $('#bodyinput').val() // value taken from note textarea
    }
  })
    // with that done
    .done(function(data) {
      // log the response
      console.log(data);

      // empty the notes section
    });
        $('#bodyinput').val("");

  // Also, remove the values entered in the input and textarea for note entry

});
