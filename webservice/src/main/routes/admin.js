'use strict';

module.exports = function (app) {
    var console = process.console;

    var express     = require('express'),
        passport    = require('passport'),
        adminRouter = express.Router(),
        mongoose    = require('mongoose'),
        models      = require('../models/models')(mongoose);

    //**************** USER ROUTER **********************
    //Middleware para estas rutas
    adminRouter.use(passport.authenticate('basic', {
        session: false,
        failureRedirect: '/error/session'
    }));

    /**
     * GET /admin/login
     * Hace login con el admin
     */
    adminRouter.get('/login', function (req, res, next) {
        res.json({
            "login": true,
            "error": ""
        });
    });

    /**
     * GET /admin/user/all
     * Obtiene la información del usuario
     */
    adminRouter.get('/user/all', function (req, res, next) {
        // Saco la lista de jugadores de todo Kafhe
        models.User
            .find({})
            .select('username alias game.afk game.gamedata')
            .populate('game.gamedata')
            .exec(function (error, playerList) {
                if (error) {
                    console.tag('MONGO').error(error);
                    res.redirect('/error/errUserListNotFound');
                    return;
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
    app.use('/admin', adminRouter);
};
