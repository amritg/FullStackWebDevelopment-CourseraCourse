var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Leaderships = require('../models/leadership');
var Verify = require('./verify');

var leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

//Middleware which verifies the oridinary user
leaderRouter.use(Verify.verifyOrdinaryUser);

leaderRouter.route('/')
    .get(function (req, res, next) {
        Leaderships.find({}, function (err, leader) {
            if (err) throw err;
            res.json(leader);
        });
    })

    .post(Verify.verifyAdmin,function (req, res, next) { //Middlware which gives following operation for Admins only
        Leaderships.create(req.body, function (err, leadership) {
            if (err) throw err;

            console.log("Leader created!");
            var id = leadership._id;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the dish with id:' + id);
        });
    })

    .delete(Verify.verifyAdmin,function (req, res, next) {
        Leaderships.remove({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

leaderRouter.route('/:leaderId')
    .get(function (req, res, next) {
        Leaderships.findById(req.params.leaderId, function (err, leader) {
            if (err) throw err;
            res.json(leader);
        });
    })

    .put(Verify.verifyAdmin,function (req, res, next) {
        Leaderships.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
        }, {
            new: true
        }, function (err, leader) {
            if (err) throw err;

            res.json(leader);
        });
    })

    .delete(Verify.verifyAdmin,function (req, res, next) {
        Leaderships.findByIdAndRemove(req.params.leaderId, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

module.exports = leaderRouter;