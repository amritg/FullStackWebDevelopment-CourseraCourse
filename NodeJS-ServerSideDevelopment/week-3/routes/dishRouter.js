var express = require('express');
var bodyParser = require('body-parser');
var Verify = require('./verify');
var mongoose = require('mongoose');
var Dishes = require('../models/dishes');

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

//Middleware which verifies the oridinary user
//dishRouter.use(Verify.verifyOrdinaryUser);

dishRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Dishes.find({}, function (err, dish) {
            if (err) throw err;
            res.json(dish);
        });
    })
    .post(Verify.verifyAdmin, function (req, res, next) {  //Middlware which gives following operation for Admins only
        //res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
        Dishes.create(req.body, function (err, dish) {
            if (err) throw err;
            res.json(resp);
        });
    })

    .delete(Verify.verifyAdmin,function (req, res, next) {
        //res.end('Deleting all dishes');
        Dishes.remove({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

dishRouter.route('/:dishId')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        //res.end('Will send details of the dish: ' + req.params.dishId + ' to you!');
        Dishes.findById(req.params.dishId, function (err, dish) {
                if (err) throw err;
                res.json(dish);
        });
    })

    .put(Verify.verifyAdmin,function (req, res, next) {
        /*res.write('Updating the dish: ' + req.params.dishId + '\n');
        res.end('Will update the dish: ' + req.body.name +
            ' with details: ' + req.body.description);*/
        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, {
            new: true
        }, function (err, dish) {
            if (err) throw err;

            res.json(dish);
        });
    })

    .delete(Verify.verifyAdmin,function (req, res, next) {
        //res.end('Deleting dish: ' + req.params.dishId);
        Dishes.findByIdAndRemove(req.params.dishId, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

dishRouter.route('/:dishId/comments')
    .all(Verify.verifyOrdinaryUser)
    .get(function (req, res, next) {
       Dishes.findById(req.params.dishId, function (err, dish) {
                if (err) throw err;
                res.json(dish.comments);
        });
    })

    .post(Verify.verifyAdmin,function (req, res, next) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) throw err;
            dish.comments.push(req.body);
            dish.save(function (err, dish) {
                if (err) throw err;
                console.log('Updated Comments!');

                res.json(dish);
            });
        });
    })

    .delete(Verify.verifyAdmin,function (req, res, next) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) throw err;
            for (var i = (dish.comments.length - 1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save(function (err, result) {
                if (err) throw err;
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all comments!');
            });
        });
    });
dishRouter.route('/:dishId/comments/:commentId')
    .all(Verify.verifyOrdinaryUser)
    .get(function (req, res, next) {
        Dishes.findById(req.params.dishId, function (err, dish) {
                if (err) throw err;
                res.json(dish.comments.id(req.params.commentId));
        });
    })

    .put(function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) throw err;
            dish.comments.id(req.params.commentId).remove();
            dish.comments.push(req.body);
            dish.save(function (err, dish) {
                if (err) throw err;
                console.log('Updated Comments!');
                res.json(dish);
            });
        });
    })

    .delete(function (req, res, next) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            dish.comments.id(req.params.commentId).remove();
            dish.save(function (err, resp) {
                if (err) throw err;
                res.json(resp);
            });
        });
    });

module.exports = dishRouter;