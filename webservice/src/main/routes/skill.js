'use strict';

module.exports = function (app) {
    var console = process.console;

    var express     = require('express'),
        passport    = require('passport'),
        utils       = require('../modules/utils'),
        utilsUser   = require('../modules/userUtils'),
        Q           = require('q'),
        skillRouter = express.Router(),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        models      = require('../models/models')(mongoose),
        config      = require('../modules/config');

    //**************** SKILL ROUTER **********************
    //Middleware para estas rutas
    skillRouter.use(bodyParser.json());
    skillRouter.use(passport.authenticate('bearer', {
        session: false
        //failureRedirect: '/error/session'
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
        else if (usuario.game.stats.fury < config.FURY_MODE_ACTIVATE_MIN_POINTS) {
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
        var usuario   = req.user,
            params    = req.body,
            idSkill   = params.skill_id, skill,
            targetIds = params.target;

        // Compruebo que la partida está en estado que puedo ejecutar habilidades
        if (usuario.game.gamedata.status !== 1) {
            console.tag('SKILL-EXECUTE').error('No se permite esta acción en el estado actual de la partida');
            utils.error(res, 400, 'errGameStatusNotAllowed');
            return;
        }

        // Compruebo que vienen los parámetros
        if (!idSkill || !targetIds || targetIds.length === 0) {
            console.tag('SKILL-EXECUTE').error('No se han enviado los parámetros necesarios');
            utils.error(res, 400, 'errSkillNoParams');
            return;
        }

        // Compruebo que la habilidad la tengo entre las ejecutables y la obtengo
        skill = utilsUser.hasSkill(usuario, idSkill);
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

        // Compruebo que le queda usos a la habilidad, si tenía
        if (skill.uses !== null && skill.uses <= 0) {
            console.tag('SKILL-EXECUTE').error('No puedo usar la habilidad más');
            utils.error(res, 400, 'errSkillNoMoreUses');
            return;
        }

        // Compruebo que el número de objetivos es correcto
        if (targetIds.length !== skill.target_number) {
            console.tag('SKILL-EXECUTE').error('No has seleccionado el número de objetivos correcto');
            utils.error(res, 400, 'errSkillNoTargetNumber');
            return;
        }

        // Saco la lista de usuarios de mi partida para seguir haciendo cosas
        models.User
            .find({"_id": {"$in": usuario.game.gamedata.players}})
            .select('game.afk')
            .exec(function (error, users) {
                if (error) {
                    console.tag('MONGO').error(error);
                    utils.error(res, 400, 'errUserListNotFound');
                    return;
                }

                // Compruebo que los id de los objetivos están entre los posibles en mi partida
                var targets = [];
                users.forEach(function (thisUser) {
                    if (targetIds.indexOf(thisUser._id) > -1) {
                        // Este es un objetivo. Compruebo que está activo
                        if (!thisUser.game.afk) {
                            console.tag('SKILL-EXECUTE').error('Alguno de los objetivos seleccionados no está activo y por lo tanto no es un objetivo válido');
                            utils.error(res, 400, 'errSkillTargetAfk');
                            return;
                        }

                        targets.push(thisUser);
                    }
                });
                // A ver si existen todos
                if (targets.length === 0 || targets.length !== targetIds.length) {
                    console.tag('SKILL-EXECUTE').error('No se han encontrado todos los objetivos seleccionados');
                    utils.error(res, 400, 'errSkillTargetsNotFound');
                    return;
                }

                // Objeto de promises para salvar los targets y el usuario
                var promises = [], combatResult, results = {damageDone: 0, kills: 0, reputation: 0};

                // Para cada target:
                targets.forEach(function (thisTarget) {
                    // Calculo el daño y defensa (me devuelve damage y protection)
                    combatResult = utilsUser.combatResult(skill, thisTarget, usuario.game.stats.fury_mode);

                    // Resto vidas y si muere, reputación
                    var resTakeDamage = utilsUser.takeDamage(thisTarget, combatResult.damage);
                    thisTarget = resTakeDamage.user;

                    //Reputación por protección del defensor
                    if (combatResult.protection > 0) {
                        var targetReputation = utilsUser.addReputation(thisTarget, combatResult.reputation, null, config.CAUSE.protection);
                        thisTarget = targetReputation.user;
                    }

                    // Actualizo furia de los target
                    thisTarget.game.stats.fury += combatResult.damage;

                    // Calculo la diferencia de niveles arma/armadura para saber la reputación que gana el atacante
                    var levelDifference = utilsUser.levelDifference(usuario, thisTarget);
                    // Si la diferencia es positiva es que el atacante es mayor que el defensor
                    // Calculo la reputación para el atacante
                    var atkReputation = utilsUser.addReputation(usuario, combatResult.damage, levelDifference, config.CAUSE.damage);
                    usuario = atkReputation.user;
                    results.reputation += atkReputation.reputation;


                    // TODO notification para este usuario???

                    promises.push(utilsUser.saveUser(thisTarget));

                    // Para el atacante, actualizo datos
                    results.damageDone += combatResult.damage;
                    if (resTakeDamage.hasDied) {
                        results.kills++;
                    }
                });


                // Resto puntos de habilidad
                usuario.game.stats.action_points -= skill.cost;

                // Resto usos de habilidad si tenía usos
                if (skill.uses !== null) {
                    var newUses = skill.uses - 1;
                    usuario = utilsUser.updateSkill(usuario, skill.id, skill.source, {uses: newUses});
                }

                // Reputación del atacante por el ataque en sí

                // Actualizo furia del usuario si estaba en modo furia
                if (usuario.game.stats.fury_mode) {
                    var resFury = utilsUser.updateFury(user, config.FURY_MODE_USE_POINTS);
                    usuario = resFury.user;
                    results.furyDisabled = resFury.furyDisabled;
                }

                // Last activity y afk
                usuario.game.afk = false;
                usuario.game.last_activity = new Date().getTime();

                // TODO notificación para el usuario atacante

                promises.push(utilsUser.saveUser(usuario));

                //Tengo que salvar los targets y el usuario
                Q.all(promises)
                    .then(function (results) {
                        //TODO notificación para la partida???
                        /*res.json({
                         "data": {
                         "user": usuario
                         },
                         "session": {
                         "access_token": req.authInfo.access_token,
                         "expire": 1000 * 60 * 60 * 24 * 30
                         },
                         "error": ""
                         });*/
                    })
                    .catch(function (error) {
                        console.tag('MONGO').error(err);
                        utils.error(res, 400, 'errMongoSave');
                        return;
                    }).done();
            });
    });

    // Asigno los router a sus rutas
    app.use('/skill', skillRouter);
};
