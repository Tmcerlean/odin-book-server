var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    firstName: { type: String, required: true, minLength: 1, maxLength: 100 },
    lastName: { type: String, required: true, minLength: 1, maxLength: 100 },
    email: { type: String, required: true, minLength: 1, maxLength: 300, unique: true },
    hashedPassword: { type: String, required: true, minLength: 1 },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    profileImageUrl: { type: String },
    facebookId: { type: String },
  }
);

// Virtual for author's full name
UserSchema
.virtual('name')
.get(function (this: any) {
  return this.family_name + ', ' + this.first_name;
});

// Apply the uniqueValidator plugin to userSchema.
UserSchema.plugin(uniqueValidator);

//Export model
module.exports = mongoose.model('User', UserSchema);