'use strict';

module.exports = function (app) {
    var console = process.console;

    var express = require('express'),
        passport = require('passport'),
    //validator = require('validator'),
        math = require('mathjs'),
        forgeRouter = express.Router(),
        utils = require('../modules/utils'),
        gameResources = require('../modules/gameResources'),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        models = require('../models/models')(mongoose);

    //**************** FURNACE ROUTER **********************
    //Middleware para estas rutas
    forgeRouter.use(bodyParser.json());
    forgeRouter.use(passport.authenticate('bearer', {
        session: false
        //failureRedirect: '/error/session'
    }));

    /**
     * POST /forge/weapon
     * Forja un arma a partir de un tostem y una runa. Requiere los siguientes parámetros en el cuerpo del POST:
     * tostem: id de inventario del tostem; rune: id de inventario de la runa; class: clase del arma a forjar
     */
    forgeRouter.post('/weapon', function (req, res, next) {
        // El objeto user
        var usuario = req.user,
            params = req.body,
            idTostem = params.tostem, tostem,
            idRune = params.rune, rune,
            clase = params.class,
            forgedWeapon = {
                id: utils.generateId(),
                name: null,
                frecuency: 'common',
                class: null, // bladed, blunt, piercing
                level: null,
                element: null,
                base_stats: {
                    damage: null,
                    precision: null
                },
                components: {
                    rune: null,
                    tostem: null
                },
                skills: [],
                equipped: false
            },
            respuesta = {
                generatedWeapon: null
            };

        // Compruebo el estado de la partida, si es 1. Si no, error
        if (usuario.game.gamedata.status !== config.GAME_STATUS.BATTLE) {
            console.tag('FORGE-WEAPON').error('No se permite esta acción en el estado actual de la partida');
            //res.redirect('/error/errGameStatusNotAllowed');
            utils.error(res, 400, 'errGameStatusNotAllowed');
            return;
        }

        // Si no me mandan los parámetros, fuera
        if (!idRune || !idTostem || !clase) {
            console.tag('FORGE-WEAPON').error('No se han enviado los datos necesarios para forjar');
            //res.redirect('/error/errForgeNoParams');
            utils.error(res, 400, 'errForgeNoParams');
            return;
        }

        // Si no tengo piedras de forja
        if (usuario.game.inventory.stones <= 0) {
            console.tag('FORGE-WEAPON').error('No tengo piedras de forja suficientes');
            //res.redirect('/error/errForgeNoStonesLeft');
            utils.error(res, 400, 'errForgeNoStonesLeft');
            return;
        }

        // La clase ha de ser una de las válidas
        if (gameResources.WEAPON_CLASSES.indexOf(clase) === -1) {
            console.tag('FORGE-WEAPON').error('No existe esa clase de arma');
            //res.redirect('/error/errForgeNoClassFound');
            utils.error(res, 400, 'errForgeNoClassFound');
            return;
        }

        // Saco el tostem del objeto usuario
        var tostemList = [];
        usuario.game.inventory.tostems.forEach(function (thisTostem) {
            if (thisTostem.id === idTostem) {
                tostem = thisTostem;
            } else {
                // Lo meto en la lista del resto de tostems
                tostemList.push(thisTostem);
            }
        });

        // Saco la runa del objeto usuario
        var runeList = [];
        usuario.game.inventory.runes.forEach(function (thisRune) {
            if (thisRune.id === idRune) {
                rune = thisRune;
            } else {
                // Lo meto en la lista del resto de tostems
                runeList.push(thisRune);
            }
        });

        // Si no he encontrado ambos, mal rollo
        if (!tostem || !rune) {
            console.tag('FORGE-WEAPON').error('No se han encontrado el tostem o la runa en el inventario del usuario');
            //res.redirect('/error/errForgeNoTostemOrRuneFound');
            utils.error(res, 400, 'errForgeNoTostemOrRuneFound');
            return;
        }

        // Verifico que ambos no están ya usandose, o mal rollo again
        if (tostem.in_use || rune.in_use) {
            console.tag('FORGE-WEAPON').error('Alguno de los componentes estaba equipado actualmente');
            //res.redirect('/error/errForgeTostemOrRuneEquipped');
            utils.error(res, 400, 'errForgeTostemOrRuneEquipped');
            return;
        }

        // Pongo más características del arma
        forgedWeapon.class = clase;
        forgedWeapon.element = tostem.element;
        forgedWeapon.components.tostem = tostem.id;
        forgedWeapon.components.rune = rune.id;
        forgedWeapon.level = tostem.level * gameResources.FRECUENCIES_TO_NUMBER[rune.frecuency];

        // Genero el nombre del arma
        forgedWeapon.name = gameResources.getRandomWeaponName(forgedWeapon, false);

        // Calculo los stats del arma según la runa. Me fijo en damage y precision
        var runeData = gameResources.findRuneByMaterial(rune.material);

        // Si es null, algo malo ha pasado
        if (runeData === null) {
            console.tag('FORGE-WEAPON').error('No se han encontrado las características de la runa');
            //res.redirect('/error/errForgeRuneStatsNotFound');
            utils.error(res, 400, 'errForgeRuneStatsNotFound');
            return;
        }

        // Hago las cuentas. Sumo el valor base del arma, y el valor base de la runa proporcional a su tipo
        forgedWeapon.base_stats.damage =
            gameResources.WEAPON_BASE_STATS.damage
            + Math.round(gameResources.RUNE_BASE_STATS.damage * runeData.stats_percentages.damage / 100);

        forgedWeapon.base_stats.precision =
            gameResources.WEAPON_BASE_STATS.precision
            + Math.round(gameResources.RUNE_BASE_STATS.precision * runeData.stats_percentages.precision / 100);

        // Habilidad básica de arma
        var weaponBasicSkill = new models.Skill({
            id: utils.generateId(),
            name: 'Ataque',
            element: forgedWeapon.element,
            'class': forgedWeapon.class,
            level: 0,
            source: 'weapon', // weapon, armor
            uses: null,
            duration: null,
            cost: 1,
            stats: {
                damage: forgedWeapon.base_stats.damage,
                precision: forgedWeapon.base_stats.precision
            },
            blocked: false,
            action: 'attack'
        });
        forgedWeapon.skills.push(weaponBasicSkill);

        // Habilidad elemental del arma *****************
        models.Skill
            .find({"element": tostem.element, "source": "weapon"})
            .exec(function (error, elementSkills) {
                if (error) {
                    console.tag('MONGO').error(error);
                    //res.redirect('/error/errSkillList');
                    utils.error(res, 400, 'errSkillList');
                    return;
                }

                // Recorro la lista de habilidades de este elemento
                var skillList = [], weaponElementalSkill;
                elementSkills.forEach(function (skill) {
                    // Busco la que es la de ataque elemental básico
                    if (skill.action === 'skillWeaponElementalAttack') {
                        weaponElementalSkill = skill;
                    } else {
                        skillList.push(skill);
                    }
                });

                // Habilidad elemental básica del arma ****************************
                if (weaponElementalSkill) {
                    weaponElementalSkill.id = utils.generateId();

                    // El daño que añade la habilidad es una fórmula realmente, que viene en damage_formula
                    // Compruebo que existen las fórmulas por seguridad ante casques
                    if (!weaponElementalSkill.stats.damage_formula || !weaponElementalSkill.stats.precision_formula) {
                        console.tag('FORGE-WEAPON').error('No existe alguna de las fórmulas en la habilidad');
                        //res.redirect('/error/errNoFormulae');
                        utils.error(res, 400, 'errNoFormulae');
                        return;
                    }

                    // Parámetros de la fórmula
                    var data = {
                        tostemLevel: tostem.level,
                        baseDamage: forgedWeapon.base_stats.damage,
                        basePrecision: forgedWeapon.base_stats.precision
                    };
                    // Ejecuto la formula para calcular el damage final que hace
                    var formula = math.eval(weaponElementalSkill.stats.damage_formula, data);

                    weaponElementalSkill.stats.damage = forgedWeapon.base_stats.damage + formula;

                    // La precisión
                    formula = math.eval(weaponElementalSkill.stats.precision_formula, data);
                    weaponElementalSkill.stats.precision = forgedWeapon.base_stats.precision + formula;

                    weaponElementalSkill.level = tostem.level;
                    weaponElementalSkill.class = forgedWeapon.class;
                    forgedWeapon.skills.push(weaponElementalSkill);
                }

                // Otras habilidades si las hubiere TODO

                // Arma generada para devolver al frontend
                respuesta.generatedWeapon = forgedWeapon;

                // Guardo el arma en el inventario del usuario
                var weaponList = usuario.game.inventory.weapons;
                weaponList.push(forgedWeapon);
                usuario.game.inventory.weapons = weaponList;

                // Actualizo la lista de tostems y runas, marcando como usadas
                // las de este arma
                tostem.in_use = true;
                rune.in_use = true;
                tostemList.push(tostem);
                runeList.push(rune);
                usuario.game.inventory.tostems = tostemList;
                usuario.game.inventory.runes = runeList;

                // Una piedra de forja menos pal body
                usuario.game.inventory.stones = usuario.game.inventory.stones - 1;

                // AFK y last_activity
                usuario.game.afk = false;
                usuario.game.last_activity = new Date().getTime();

                res.json({
                    "data": {
                        "user": usuario,
                        "result": respuesta
                    },
                    "session": {
                        "access_token": req.authInfo.access_token,
                        "expire": 1000 * 60 * 60 * 24 * 30
                    },
                    "error": ""
                });

                //TODO Guardo el usuario
                /*usuario.save(function (err) {
                 if (err) {
                 console.tag('MONGO').error(err);
                 res.redirect('/error/errMongoSave');
                 return;
                 } else {
                 res.json({
                 "data": {
                 "user": usuario,
                 "result": respuesta
                 },
                 "session": {
                 "access_token": req.authInfo.access_token,
                 "expire": 1000 * 60 * 60 * 24 * 30
                 },
                 "error": ""
                 });
                 }
                 });*/
            });
    });


    /**
     * POST /forge/armor
     * Forja una armadura a partir de un tostem y una runa. Requiere los siguientes parámetros en el cuerpo del POST:
     * tostem: id de inventario del tostem; rune: id de inventario de la runa; class: clase de armadura a forjar
     */
    forgeRouter.post('/armor', function (req, res, next) {
        // El objeto user
        var usuario = req.user,
            params = req.body,
            idTostem = params.tostem, tostem,
            idRune = params.rune, rune,
            clase = params.class,
            forgedArmor = {
                id: utils.generateId(),
                name: null,
                frecuency: 'common',
                class: null, // light, medium, heavy
                element: null,
                level: null,
                base_stats: {
                    protection: null,
                    parry: null
                },
                components: {
                    rune: null,
                    tostem: null
                },
                skills: [],
                equipped: false
            },
            respuesta = {
                generatedArmor: null
            };

        // Compruebo el estado de la partida, si es 1. Si no, error
        if (usuario.game.gamedata.status !== config.GAME_STATUS.BATTLE) {
            console.tag('FORGE-ARMOR').error('No se permite esta acción en el estado actual de la partida');
            //res.redirect('/error/errGameStatusNotAllowed');
            utils.error(res, 400, 'errGameStatusNotAllowed');
            return;
        }

        // Si no me mandan los parámetros, fuera
        if (!idRune || !idTostem || !clase) {
            console.tag('FORGE-ARMOR').error('No se han enviado los datos necesarios para forjar');
            //res.redirect('/error/errForgeNoParams');
            utils.error(res, 400, 'errForgeNoParams');
            return;
        }

        // Si no tengo piedras de forja
        if (usuario.game.inventory.stones <= 0) {
            console.tag('FORGE-ARMOR').error('No tengo piedras de forja suficientes');
            //res.redirect('/error/errForgeNoStonesLeft');
            utils.error(res, 400, 'errForgeNoStonesLeft');
            return;
        }

        // La clase ha de ser una de las válidas
        if (gameResources.ARMOR_CLASSES.indexOf(clase) === -1) {
            console.tag('FORGE-ARMOR').error('No existe esa clase de objeto a forjar');
            //res.redirect('/error/errForgeNoClassFound');
            utils.error(res, 400, 'errForgeNoClassFound');
            return;
        }

        // Saco el tostem del objeto usuario
        var tostemList = [];
        usuario.game.inventory.tostems.forEach(function (thisTostem) {
            if (thisTostem.id === idTostem) {
                tostem = thisTostem;
            } else {
                // Lo meto en la lista del resto de tostems
                tostemList.push(thisTostem);
            }
        });

        // Saco la runa del objeto usuario
        var runeList = [];
        usuario.game.inventory.runes.forEach(function (thisRune) {
            if (thisRune.id === idRune) {
                rune = thisRune;
            } else {
                // Lo meto en la lista del resto de tostems
                runeList.push(thisRune);
            }
        });

        // Si no he encontrado ambos, mal rollo
        if (!tostem || !rune) {
            console.tag('FORGE-ARMOR').error('No se han encontrado el tostem o la runa en el inventario del usuario');
            //res.redirect('/error/errForgeNoTostemOrRuneFound');
            utils.error(res, 400, 'errForgeNoTostemOrRuneFound');
            return;
        }

        // Verifico que ambos no están ya usandose, o mal rollo again
        if (tostem.in_use || rune.in_use) {
            console.tag('FORGE-ARMOR').error('Alguno de los componentes estaba equipado actualmente');
            //res.redirect('/error/errForgeTostemOrRuneEquipped');
            utils.error(res, 400, 'errForgeTostemOrRuneEquipped');
            return;
        }

        // Pongo más características del arma
        forgedArmor.class = clase;
        forgedArmor.element = tostem.element;
        forgedArmor.components.tostem = tostem.id;
        forgedArmor.components.rune = rune.id;
        forgedArmor.level = tostem.level * gameResources.FRECUENCIES_TO_NUMBER[rune.frecuency];

        // Genero el nombre del arma
        forgedArmor.name = gameResources.getRandomArmorName(forgedArmor, false);

        // Calculo los stats del arma según la runa. Me fijo en damage y precision
        var runeData = gameResources.findRuneByMaterial(rune.material);

        // Si es null, algo malo ha pasado
        if (runeData === null) {
            console.tag('FORGE-ARMOR').error('No se han encontrado las características de la runa');
            //res.redirect('/error/errForgeRuneStatsNotFound');
            utils.error(res, 400, 'errForgeRuneStatsNotFound');
            return;
        }

        // Los stats. Valores base de la armadura
        forgedArmor.base_stats.protection =
            gameResources.ARMOR_BASE_STATS.protection
            + Math.round(gameResources.RUNE_BASE_STATS.protection * runeData.stats_percentages.protection / 100);

        forgedArmor.base_stats.parry =
            gameResources.ARMOR_BASE_STATS.parry
            + Math.round(gameResources.RUNE_BASE_STATS.parry * runeData.stats_percentages.parry / 100);

        // TODO Habilidad del armadura (de momento nada)

        // Arma generada para devolver al frontend
        respuesta.generatedArmor = forgedArmor;

        // Guardo el arma en el inventario del usuario
        var armorList = usuario.game.inventory.armors;
        armorList.push(forgedArmor);
        usuario.game.inventory.armors = armorList;

        // Actualizo la lista de tostems y runas, marcando como usadas
        // las de este armadura
        tostem.in_use = true;
        rune.in_use = true;
        tostemList.push(tostem);
        runeList.push(rune);
        usuario.game.inventory.tostems = tostemList;
        usuario.game.inventory.runes = runeList;

        // Una piedra de forja menos pal body
        usuario.game.inventory.stones = usuario.game.inventory.stones - 1;

        // AFK y last_activity
        usuario.game.afk = false;
        usuario.game.last_activity = new Date().getTime();

        res.json({
            "data": {
                "user": usuario,
                "result": respuesta
            },
            "session": {
                "access_token": req.authInfo.access_token,
                "expire": 1000 * 60 * 60 * 24 * 30
            },
            "error": ""
        });

        //TODO Guardo el usuario
        /*usuario.save(function (err) {
         if (err) {
         console.tag('MONGO').error(err);
         res.redirect('/error/errMongoSave');
         return;
         } else {
         res.json({
         "data": {
         "user": usuario,
         "result": respuesta
         },
         "session": {
         "access_token": req.authInfo.access_token,
         "expire": 1000 * 60 * 60 * 24 * 30
         },
         "error": ""
         });
         }
         });*/
    });

    // Asigno los router a sus rutas
    app.use('/forge', forgeRouter);
};
