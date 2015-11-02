'use strict';

module.exports = function (app) {
    var console = process.console;

    var express     = require('express'),
        passport    = require('passport'),
        adminRouter = express.Router(),
        bodyParser  = require('body-parser'),
        config      = require('../modules/config'),
        crypto      = require('crypto'),
        mongoose    = require('mongoose'),
        models      = require('../models/models')(mongoose);

    //**************** USER ROUTER **********************
    //Middleware para estas rutas
    adminRouter.use(bodyParser.json());
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
                    console.tag('ADMIN-MONGO').error(error);
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

    /**
     * POST /admin/user/new
     * Crea un nuevo usuario
     */
    adminRouter.post('/user/new', function (req, res, next) {
        var params = req.body,
            alias  = null;

        if (!params.username) {
            console.tag('ADMIN-USER-NEW').error('No se ha proporcionado el nombre de usuario a crear');
            res.redirect('/error/errAdminNewUserNoUsername');
            return;
        }

        // Alias
        if (params.alias) {
            alias = params.alias;
        }

        //Hasheo el username y token
        var shasum = crypto.createHash('sha512');
        shasum.update(config.DEFAULT_PASSWORD);
        var pass = shasum.digest('hex');

        var user = new models.User({
            username: params.username,
            password: pass,
            alias: alias
        });


        user.save(function (err) {
            if (err) {
                console.tag('ADMIN-MONGO').error(err);

                if (err.code === 11000) {
                    res.redirect('/error/errMongoDuplicatedUsername');
                } else {
                    res.redirect('/error/errMongoSave');
                }
                return;
            } else {
                res.json({
                    "result": true,
                    "error": ""
                });
            }
        });
    });

    // Asigno los router a sus rutas
    app.use('/admin', adminRouter);
};
