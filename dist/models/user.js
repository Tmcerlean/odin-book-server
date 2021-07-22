"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    firstName: { type: String, required: true, minLength: 1, maxLength: 100 },
    lastName: { type: String, required: true, minLength: 1, maxLength: 100 },
    email: { type: String, required: true, minLength: 1, maxLength: 300 },
    hashedPassword: { type: String, required: true, minLength: 1 },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    profileImageUrl: { type: String, required: false },
    facebookId: { type: String, required: false },
});
// Virtual for author's full name
UserSchema
    .virtual('name')
    .get(function () {
    return this.family_name + ', ' + this.first_name;
});
//Export model
module.exports = mongoose.model('User', UserSchema);
//# sourceMappingURL=user.js.map