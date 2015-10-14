'use strict';

module.exports = function (app) {
    var console = process.console;

    var express = require('express'),
        passport = require('passport'),
    //bodyParser   = require('body-parser'),
    //urlencodedParser = bodyParser.urlencoded({extended: false}),
        pruebaRouter = express.Router(),
        failRouter = express.Router(),
        mongoose = require('mongoose'),
        models = require('../models/models')(mongoose);

    //**************** LOGIN ROUTER **********************
    //Middleware para estas rutas
    //pruebaRouter.use(urlencodedParser);
    pruebaRouter.use(passport.authenticate('bearer', {
        session: false,
        //successRedirect: '/ok',
        failureRedirect: '/failete'
    }));
    //Si se hace login correctamente, pasará aquí
    pruebaRouter.get('/', function (req, res, next) {
        console.log("POST");
        console.log(req.user);
        console.log(req.authInfo);
        //TODO aquí haría lo que fuera que me han pedido

        //Voy a intentar rescatar un usuario de base de datos
        models.User
            .findOne({"username": "pepe"})
            .populate('game.data')
            .exec(function (error, user) {
                if (error) {
                    res.status(500).json({
                        "error": error
                    });
                }

                res.json({
                    "message": 'Welcome again pesao',
                    "user": user,
                    "error": ""
                });
            });
    });

    //**************** LOGIN FAIL ROUTER **********************
    //GET sobre el raíz del failete router (es decir sobre /failete)
    failRouter.get('/', function (req, res, next) {
        console.log("FAILETE");
        res.json({"error": "err405"});
    });

    // Asigno los router a sus rutas
    app.use('/prueba', pruebaRouter);
    app.use('/failete', failRouter);
};

//Use new Aggregate({ $match: { _id: mongoose.Schema.Types.ObjectId('00000000000000000000000a') } }); instead.
