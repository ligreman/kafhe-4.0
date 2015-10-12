'use strict';

module.exports = function (app) {
    var console = process.console;

    var express    = require('express'),
        passport   = require('passport'),
        userRouter = express.Router(),
        mongoose   = require('mongoose'),
        modelos    = require('../models/models')(mongoose);

    //**************** USER ROUTER **********************
    //Middleware para estas rutas
    userRouter.use(passport.authenticate('bearer', {
        session: false,
        failureRedirect: '/error'
    }));

    /**
     * /user
     * Obtiene la información del usuario
     */
    userRouter.get('/', function (req, res, next) {
        res.json({
            "data": req.user,
            "error": ""
        });
    });


    // Asigno los router a sus rutas
    app.use('/user', userRouter);
};