'use strict';

module.exports = function (app) {
    var console = process.console;

    var express     = require('express'),
        passport    = require('passport'),
        skillRouter = express.Router(),
        mongoose    = require('mongoose'),
        models      = require('../models/models')(mongoose);

    //**************** SKILL ROUTER **********************
    //Middleware para estas rutas
    skillRouter.use(passport.authenticate('bearer', {
        session: false,
        failureRedirect: '/error/session'
    }));

    /**
     * GET /skill/list
     * Obtiene la lista de habilidades
     */
    skillRouter.get('/list', function (req, res, next) {
        // Saco la lista de habilidades y la devuelvo
        models.Skill.find({})
            .exec(function (error, skills) {
                if (error) {
                    console.tag('MONGO').error(error);
                    res.redirect('/error/errSkillListNotFound');
                    return;
                }

                res.json({
                    "data": {
                        "skills": skills
                    },
                    "session": {
                        "access_token": req.authInfo.access_token,
                        "expire": 1000 * 60 * 60 * 24 * 30
                    },
                    "error": ""
                });
            });

    });


    /**
     * POST /skill/fury
     * Activa la habilidad de furia
     */
    skillRouter.post('/fury', function (req, res, next) {
        // El objeto user
        var usuario = req.user;

        // Si ya está activo el modo furia no lo activo de nuevo
        if (usuario.game.stats.fury_mode) {
            console.tag('FURY').error('Ya estaba activo el modo furia');
            res.redirect('/error/errFuryAlreadyActive');
            return;
        } else {
            // Actualizo el objeto usuario activando el modo furia
            usuario.game.stats.fury_mode = true;

            // Guardo el usuario
            usuario.save(function (err) {
                if (err) {
                    console.tag('MONGO').error(err);
                    res.redirect('/error/errMongoSave');
                    return;
                } else {
                    res.json({
                        "data": {
                            "user": usuario
                        },
                        "session": {
                            "access_token": req.authInfo.access_token,
                            "expire": 1000 * 60 * 60 * 24 * 30
                        },
                        "error": ""
                    });
                }
            });
        }
    });

    // Asigno los router a sus rutas
    app.use('/skill', skillRouter);
};
