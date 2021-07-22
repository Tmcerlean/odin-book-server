"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User" },
    comment: { type: String, required: true, minLength: 1, maxLength: 300 },
    timestamp: { type: Date, required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});
CommentSchema.virtual("date_formated").get(function () {
    return this.timestamp.toLocaleDateString("en-gb", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minutes: "2-digit",
    });
});
//Export model
module.exports = mongoose.model('Comment', CommentSchema);
//# sourceMappingURL=comment.js.map