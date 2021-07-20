var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema(
  {
    author: {type: Schema.Types.ObjectId, ref: "User"},
    content: {type: String, required: true, minLength: 1},
    timestamp: {type: Date, default: Date.now, required: true},
    imageUrl: {type: String, required: false},
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  }
);

PostSchema.virtual("date_formated").get(function (this: any) {
  return this.timestamp.toLocaleDateString("en-gb", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minutes: "2-digit",
  });
});

//Export model
module.exports = mongoose.model('Post', PostSchema);