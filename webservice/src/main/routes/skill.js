'use strict';

module.exports = function (app) {
    var console = process.console;

    var express     = require('express'),
        passport    = require('passport'),
        skillRouter = express.Router(),
        mongoose    = require('mongoose'),
        modelos     = require('../models/models')(mongoose);

    //**************** SKILL ROUTER **********************
    //Middleware para estas rutas
    skillRouter.use(passport.authenticate('bearer', {
        session: false,
        failureRedirect: '/error/session'
    }));

    /**
     * /skill/list
     * Obtiene la lista de habilidades
     */
    skillRouter.get('/list', function (req, res, next) {
        // Saco la lista de habilidades y la devuelvo
        modelos.Skill.find({})
            .exec(function (error, skills) {
                if (error) {
                    res.redirect('/error');
                }

                res.json({
                    "data": {
                        "skills": skills
                    },
                    "error": ""
                });
            });

    });


    /**
     * /skill/fury
     * Activa la habilidad de furia
     */
    skillRouter.get('/fury', function (req, res, next) {
        // El objeto user
        var usuario = req.user;

        // Actualizo el objeto usuario activando el modo furia
        usuario.game.stats.furyMode = true;

        // Guardo el usuario
        usuario.save(function (err, product, numAffected) {
            console.log(product);
            console.log("Afecto: " + numAffected);
            if (err) {
                res.redirect('/error');
            } else {
                res.json({
                    "data": {
                        "user": usuario
                    },
                    "error": ""
                });
            }
        });
    });

    // Asigno los router a sus rutas
    app.use('/skill', skillRouter);
};