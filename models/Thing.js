const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
    // userId: { type: String, required: false},
    name: { type: String, required: true},
    manufacturer: { type: String, required: true},
    description: { type: String, required: true},
    mainPepper: { type: String, required: true},
    imageUrl: { type: String, required: false},
    heat: { type: Number, required: true},
    // likes : { type: Number, required: false},
    // dislikes : { type: Number, required: false},
    // usersLiked : { type: Number, required: false},
    // usersDisLiked : { type: Number, required: false},
});

module.exports = mongoose.model('Thing', thingSchema);