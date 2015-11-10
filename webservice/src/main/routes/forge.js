'use strict';

/*
 Forja un arma en la forja.

 **Parámetros**

 - idInventoryA: id de la runa
 - idInventoryB: id del tostem
 - class: la clase de arma a forjar (cortante, contundente o perforante)

 **Reglas**



 **Otros**

 Necesitaré una lista de nombres de armas de cada clase (lanza, espada, etc...) para elegir aleatoriamente.
 */

module.exports = function (app) {
    var console = process.console;

    var express     = require('express'),
        passport    = require('passport'),
        //validator = require('validator'),
        forgeRouter = express.Router(),
        //utils = require('../modules/utils'),
        //gameResources = require('../modules/gameResources'),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose');

    //**************** FURNACE ROUTER **********************
    //Middleware para estas rutas
    forgeRouter.use(bodyParser.json());
    forgeRouter.use(passport.authenticate('bearer', {
        session: false,
        failureRedirect: '/error/session'
    }));

    /**
     * POST /forge/weapon
     * Forja un arma a partir de un tostem y una runa. Requiere los siguientes parámetros en el cuerpo del POST:
     * tostem: id de inventario del tostem; rune: id de inventario de la runa; class: clase del arma a forjar
     */
    forgeRouter.post('/weapon', function (req, res, next) {
        // El objeto user
        var user         = req.user,
            params       = req.body,
            idTostem     = params.tostem, tostem,
            idRune       = params.rune, rune,
            clase        = params.class,
            forgedWeapon = {
                id: utils.generateId(),
                name: null,
                frecuency: 'common',
                class: null, // bladed, blunt, piercing
                element: null,
                base_stats: {
                    damage: null,
                    precision: null
                },
                materials: {
                    rune: null,
                    tostem: null
                },
                skills: [],
                equipped: false
            },
            respuesta    = {
                generatedWeapon: null
            };

        // Compruebo el estado de la partida, si es 1. Si no, error
        if (usuario.game.gamedata.status !== 1) {
            console.tag('FORGE-WEAPON').error('No se permite esta acción en el estado actual de la partida');
            res.redirect('/error/errGameStatusNotAllowed');
            return;
        }

        // Si no me mandan los parámetros, fuera
        if (!idRune || !idTostem || !clase) {
            console.tag('FORGE-WEAPON').error('No se han enviado los datos necesarios para forjar');
            res.redirect('/error/errForgeNoParams');
            return;
        }

        // Si no tengo piedras de forja
        if (user.game.inventory.stones <= 0) {
            console.tag('FORGE-WEAPON').error('No tengo piedras de forja suficientes');
            res.redirect('/error/errForgeNoStonesLeft');
            return;
        }

        // La clase ha de ser una de las válidas
        if (gameResources.WEAPON_CLASSES.indexOf(clase) === -1) {
            console.tag('FORGE-WEAPON').error('No existe esa clase de arma');
            res.redirect('/error/errForgeNoClassFound');
            return;
        }

        // Saco el tostem del objeto usuario
        usuario.game.inventory.tostems.forEach(function (thisTostem) {
            if (thisTostem.id === idTostem) {
                tostem = thisTostem;
            }
        });

        // Saco la runa del objeto usuario
        usuario.game.inventory.runes.forEach(function (thisRune) {
            if (thisRune.id === idRune) {
                rune = thisRune;
            }
        });

        // Si no he encontrado ambos, mal rollo
        if (!tostem || !rune) {
            console.tag('FORGE-WEAPON').error('No se han encontrado el tostem o la runa en el inventario del usuario');
            res.redirect('/error/errForgeNoTostemOrRuneFound');
            return;
        }

        // Verifico que ambos no están equipados, o mal rollo again
        if (tostem.equipped || rune.equipped) {
            console.tag('FORGE-WEAPON').error('Alguno de los componentes estaba equipado actualmente');
            res.redirect('/error/errForgeTostemOrRuneEquipped');
            return;
        }

        // Pongo más características del arma
        forgedWeapon.class = clase;
        forgedWeapon.element = tostem.type;
        forgedWeapon.materials.tostem = tostem.id;
        forgedWeapon.materials.rune = rune.id;
        forgedWeapon.level = tostem.level * gameResources.frecuenciesToNumber(rune.frecuency);

        // Genero el nombre del arma TODO

        // Calculo los stats del arma según la runa. Me fijo en damage y precision
        var runeData = gameResources.findRuneByType(rune.type);

        // Si es null, algo malo ha pasado
        if (runeData === null) {
            console.tag('FORGE-WEAPON').error('No se han encontrado las características de la runa');
            res.redirect('/error/errForgeRuneStatsNotFound');
            return;
        }

        // Hago las cuentas. Sumo el valor base del arma, y el valor base de la runa proporcional a su tipo
        forgedWeapon.base_stats.damage =
            gameResources.WEAPON_BASE_STATS.damage
            + Math.round(gameResources.RUNE_BASE_STATS.damage * runeData.stats_percentages.damage / 100);

        forgedWeapon.base_stats.precision =
            gameResources.WEAPON_BASE_STATS.precision
            + Math.round(gameResources.RUNE_BASE_STATS.precision * runeData.stats_percentages.precision / 100);

        // Genero la habilidad del arma según el nivel del tostem
        var weaponSkill = {
            id: utils.generateId(),
            name: String,
            element: tostem.type,
            level: tostem.level,
            source: 'weapon', // common, weapon, armor
            uses: Number,
            duration: Number,
            cost: Number,
            stats: {
                life: {type: Number, default: 0},
                fury: {type: Number, default: 0},
                damage: {type: Number, default: 0},
                precision: {type: Number, default: 0},
                protection: {type: Number, default: 0},
                parry: {type: Number, default: 0}
            },
            blocked: false,
            action: String
        };

        // TODO GENERAR LA HABILIDAD

        // Guardo la skill en el arma
        forgedWeapon.skills.push(weaponSkill);

        // Arma generada para devolver al frontend
        respuesta.generatedWeapon = forgedWeapon;

        // Guardo el arma en el inventario del usuario
        var weaponList = usuario.game.inventory.weapons;
        weaponList.push(forgedWeapon);
        usuario.game.inventory.weapons = weaponList;

        // Guardo el usuario
        usuario.save(function (err) {
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
        });
    });

    // Asigno los router a sus rutas
    app.use('/forge', forgeRouter);
};
