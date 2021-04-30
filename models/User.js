const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseFieldEncryption = require('mongoose-field-encryption').fieldEncryption;

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  });
  
userSchema.plugin(uniqueValidator);

userSchema.plugin(mongooseFieldEncryption, {fields: "email", secret: "some secret key"});

module.exports = mongoose.model('User', userSchema);
