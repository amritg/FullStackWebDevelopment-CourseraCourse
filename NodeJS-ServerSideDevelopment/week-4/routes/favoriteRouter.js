var express = require('express');
var bodyParser = require('body-parser');
var Verify = require('./verify');
var mongoose = require('mongoose');
var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function(req,res,next){
        Favorites.find({postedBy: req.decoded._doc._id})
            .populate('postedBy')
            .populate('dishes')
            .exec(function (err,favorites){
                if(err) throw error;
                res.json(favorites);
            });
    })
    .post(Verify.verifyOrdinaryUser, function(req,res,next){
        Favorites.find({postedBy: req.decoded._doc._id})
            .exec(function(err,favorite){
                if(err){
                    var err = new Error('Sorry, We cannot add this item due to internal server error ! Please TR AGAIN by refreshing the page!');
                    err.status = 403;
                    return next(err);
                }else if (favorite.length === 0){       // there is not any favorite list. So Create it
                    Favorites.create({postedBy: req.decoded._doc._id, dishes: req.body},function(err,favorite){
                        //console.log(err);
                        //console.log(favorite);
                        res.json(favorite);
                    });
                    
                }
                else{           // there is favorite list, so push the selected Dish to dishes array of favorite array
                    //console.log(favorite);
                    //console.log(favorite.length);
                    favorite[0].dishes.push(req.body);
                    favorite[0].save(function (err, favorite) {
                        if (err) throw err;
                        console.log('Added to the Favorites List!');
                        res.json(favorite);
                    });
                }
            });
    })
    .delete(Verify.verifyOrdinaryUser, function(req,res,next){
        console.log(req.decoded._doc._id);
        Favorites.findOneAndRemove({postedBy: req.decoded._doc._id},function(err,list){ //Find and remove the favorite list based on loggedin Users
            console.log("Your favorite list is removed which is : ");
            console.log(list);
            res.json(list);
        });
    });
favoriteRouter.route('/:dishObjectId')
    .delete(Verify.verifyOrdinaryUser,function(req,res,next){
        //console.log(req.decoded._doc._id);
        Favorites.find({postedBy: req.decoded._doc._id})
            .exec(function(err,favorite){
                //console.log(err);
                if (err) throw err;
                //console.log(favorite);
                var indexOfDish = favorite[0].dishes.indexOf(req.params.dishObjectId);
                favorite[0].dishes.splice(indexOfDish,1);
                //console.log(favorite[0].dishes);
                //console.log("Favorite item is with id: "+ req.params.dishObjectId + " deleted");
                
                favorite[0].save(function (err, favorite) {
                    if (err) throw err;
                    res.json(favorite);
                });
            });
    });

module.exports = favoriteRouter;