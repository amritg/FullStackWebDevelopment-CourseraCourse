//  grab the things we need
var mongoose = require('mongoose');

//  create a Favorites Schema
var Schema = mongoose.Schema;

var favoriteSchema = new Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Dish'
    }]
},{
    timestamps : true
});

//create Favorites model which uses favoriteSchema Schema
var Favorites = mongoose.model('Favorite', favoriteSchema);

//make this available to our Node applications
module.exports = Favorites;