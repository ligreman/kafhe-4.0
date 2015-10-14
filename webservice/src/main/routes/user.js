'use strict';

module.exports = function (app) {
    var console = process.console;

    var express = require('express'),
        passport = require('passport'),
        userRouter = express.Router(),
        mongoose = require('mongoose'),
        models = require('../models/models')(mongoose);

    //**************** USER ROUTER **********************
    //Middleware para estas rutas
    userRouter.use(passport.authenticate('bearer', {
        session: false,
        failureRedirect: '/error/session'
    }));

    /**
     * GET /user
     * Obtiene la información del usuario
     */
    userRouter.get('/', function (req, res, next) {
        res.json({
            "data": {
                "user": req.user
            },
            "error": ""
        });
    });

    /**
     * GET /user/list
     * Obtiene la información de los usuarios de esta partida
     */
    userRouter.get('/list', function (req, res, next) {

        // Saco la lista de jugadores de la partida
        var players = req.user.game.gamedata.players;

        // Hago una búsqueda de esa lista de usuarios
        models.User
            .find({"_id": {"$in": players}})
            .select('-_id -__v username alias avatar game.afk game.reputation game.level')
            .exec(function (error, playerList) {
                if (error) {
                    res.redirect('/error');
                }

                res.json({
                    "data": {
                        "players": playerList
                    },
                    "error": ""
                });
            });
    });

    // Asigno los router a sus rutas
    app.use('/user', userRouter);
};
