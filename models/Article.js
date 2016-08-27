// require mongoose
var mongoose = require('mongoose');
// create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is required
  title: {
    type:String,
    required:true
  },
  // link is required
  url: {
    type:String,
    required:true
  },
  summary: {
    type: String
  },
  comments: {
    type: Array
  },

  // this only saves one note's ObjectId. ref refers to the Note model.
  // id: {
  //     type: Number,
  // },
  note: {
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model('Article', ArticleSchema);

// export the model
module.exports = Article;
