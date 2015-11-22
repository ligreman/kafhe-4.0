'use strict';

module.exports = function (app) {
    var console = process.console;

    var express     = require('express'),
        passport    = require('passport'),
        utils       = require('../modules/utils'),
        utilsUser   = require('../modules/userUtils'),
        skillRouter = express.Router(),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        models      = require('../models/models')(mongoose),
        config      = require('../modules/config');

    //**************** SKILL ROUTER **********************
    //Middleware para estas rutas
    skillRouter.use(bodyParser.json());
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
                    //res.redirect('/error/errSkillListNotFound');
                    utils.error(res, 400, 'errSkillListNotFound');
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
     * GET /skill/fury
     * Activa la habilidad de furia
     */
    skillRouter.get('/fury', function (req, res, next) {
        // El objeto user
        var usuario = req.user;

        // Compruebo el estado de la partida, si es 1. Si no, error
        if (usuario.game.gamedata.status !== 1) {
            console.tag('ORDER-DELETE').error('No se permite esta acción en el estado actual de la partida');
            //res.redirect('/error/errGameStatusNotAllowed');
            utils.error(res, 400, 'errGameStatusNotAllowed');
            return;
        }

        // Si ya está activo el modo furia no lo activo de nuevo
        if (usuario.game.stats.fury_mode) {
            console.tag('FURY').error('Ya estaba activo el modo furia');
            //res.redirect('/error/errFuryAlreadyActive');
            utils.error(res, 400, 'errFuryAlreadyActive');
            return;
        }
        // Miro a ver si tiene al menos 100 puntos de furia para poder activarla
        else if (usuario.game.stats.fury < config.FURY_MODE_MIN_POINTS) {
            console.tag('FURY').error('No tiene suficientes puntos de furia');
            //res.redirect('/error/errFuryNotEnoughPoints');
            utils.error(res, 400, 'errFuryNotEnoughPoints');
            return;
        }
        // Puedo activarla
        else {
            // Actualizo el objeto usuario activando el modo furia
            usuario.game.stats.fury_mode = true;

            // Guardo el usuario
            usuario.save(function (err) {
                if (err) {
                    console.tag('MONGO').error(err);
                    //res.redirect('/error/errMongoSave');
                    utils.error(res, 400, 'errMongoSave');
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

    /**
     * POST /skill/execute
     * Ejecuta una habilidad. Recibe por parámetros:
     * skill_id: id de la habilidad, target: array de objetivos
     */
    skillRouter.post('/execute', function (req, res, next) {
        // El objeto user
        var usuario = req.user,
            params  = req.body,
            idSkill = params.skill_id,
            targets = params.target;

        // Compruebo que la partida está en estado que puedo ejecutar habilidades
        if (usuario.game.gamedata.status !== 1) {
            console.tag('SKILL-EXECUTE').error('No se permite esta acción en el estado actual de la partida');
            utils.error(res, 400, 'errGameStatusNotAllowed');
            return;
        }

        // Compruebo que vienen los parámetros
        if (!idSkill || !targets || targets.length === 0) {
            console.tag('SKILL-EXECUTE').error('No se han enviado los parámetros necesarios');
            utils.error(res, 400, 'errSkillNoParams');
            return;
        }

        // Compruebo que la habilidad la tengo entre las ejecutables y la obtengo
        var skill = utilsUser.hasSkill(usuario, idSkill);
        if (!skill) {
            console.tag('SKILL-EXECUTE').error('No tengo esa habilidad');
            utils.error(res, 400, 'errSkillNotFound');
            return;
        }

        // Compruebo que tengo puntos de acción para ejecutarla
        if (usuario.game.stats.action_points < skill.cost) {
            console.tag('SKILL-EXECUTE').error('No tengo puntos de acción para ejecutar esa habilidad');
            utils.error(res, 400, 'errSkillNoActionPoints');
            return;
        }

        // Compruebo que le queda usos a la habilidad
        // Compruebo que el número de objetivos es correcto
        // Compruebo que los id de los objetivos están entre los posibles en mi partida
        // Compruebo que

        // Saco los objetos usuario de los objetivos
        /*
         models.User
         .find({"_id": {"$in": players}})
         .select('-_id username alias avatar game.afk game.stats.reputation game.level')
         */

        // Compruebo que están activos ya que no puedo hacer objetivo a uno inactivo

        // Para cada target:
        //      Calculo el daño y defensa
        //      Resto vidas y si muere, reputación

        // Resto punto de habilidad
        // Resto usos de habilidad
        // Reputación de los usuarios involucrados
        // Actualizo furia de los target
        // Actualizo furia del usuario si estaba en modo furia

        // Last activity y afk

    });

    // Asigno los router a sus rutas
    app.use('/skill', skillRouter);
};
