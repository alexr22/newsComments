var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars')
var request = require('request'); // Snatches html from urls
var cheerio = require('cheerio'); // Scrapes our html
var mongoose = require('mongoose');
var PORT = process.env.PORT || 3000;

// use morgan and bodyparser with our app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// make public a static dir
app.use(express.static('public'));



// Database configuration with mongoose
mongoose.connect('monogdb://heroku_mf4k95lh:bqch1ahsrkk2ueoh8p3kc579oo@ds017726.mlab.com:17726/heroku_mf4k95lh');
var db = mongoose.connection;

// show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});


db.once('open', function() {
  console.log('Mongoose connection successful.');
});

var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

app.get('/', function(req, res) {
	res.send('index.html');
});


app.get('/scrape', function(req, res) {
	request('http://deadspin.com/', function(error, response, html) {
	var $ = cheerio.load(html);
		if (!error && response.statusCode == 200) {

			$('h1.entry-title').each(function(i, element) {
				// var a = $(this).prev();
				// var url = a.attr('href');
				// var title = a.text();
				// console.log(a.text());
				// console.log(url);
				var result = {};
				result.title = $(this).children().text();
				result.url = $(this).children().attr('href');
				result.summary = $(this).children().parent().parent().next().children('.excerpt').text();
				

				var entry = new Article (result);
				entry.save(function(err, doc) {
					if (err) {
						console.log(err);
					}else {
						console.log(doc);
					}
				})
			})
		}

	})
	res.send("Scrape Complete");
})


// app.get('/articles/:id', function(req, res) {

// 	Note.findOne({'_id': req.params._id})
// 	.populate('note')
// 	.exec(function(err, doc){
// 		if (err){
// 			console.log(err)
// 		}else {
// 			res.json(doc);
// 		}
// 	})

// })

app.get('/articles/:_id', function(req, res){
	// using the id passed in the id parameter, 
	// prepare a query that finds the matching one in our db...
	 //console.log(req.paramas._id)
		Article.findOne({'_id': req.params._id})
		// and populate all of the notes associated with it.
		.populate('note')
		// now, execute our query
		.exec(function(err, doc){
			// log any errors
			if (err){
				console.log(err);
			} 
			// otherwise, send the doc to the browser as a json object
			else {
				res.json(doc);
			}
		});
	
});

app.post('/articles/:_id', function(req, res){
	// create a new note and pass the req.body to the entry.
	var newNote = new Note(req.body);

	// and save the new note the db
	newNote.save(function(err, doc){
		// log any errors
		if(err){
			console.log(err);
		} 
		// otherwise
		else {
			// using the Article id passed in the id parameter of our url, 
			// prepare a query that finds the matching Article in our db
			// and update it to make it's lone note the one we just saved
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			// execute the above query
			.exec(function(err, doc){
				// log any errors
				if (err){
					console.log(err);
				} else {
					// or send the document to the browser
					res.send(doc);
				}
			});
		}
	});
});


app.get('/articles', function(req, res){
	// grab every doc in the Articles array
		Article.find({}, function(err, doc){
			// log any errors
			if (err){
				console.log(err);
			} 
			// or send the doc to the browser as a json object
			else {
				res.json(doc);
			}
		});
});

app.listen(PORT, function() {
  console.log('App running on port 3000!');
});

