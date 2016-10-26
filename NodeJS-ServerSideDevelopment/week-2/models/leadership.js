// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a leadership schema
var leadershipSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation:  {
        type: String,
        required: true
    },
    abbr:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
// the schema is useless so far
// we need to create a model using it
var Leaders = mongoose.model('Leader', leadershipSchema);

// make this available to our Node applications
module.exports = Leaders;