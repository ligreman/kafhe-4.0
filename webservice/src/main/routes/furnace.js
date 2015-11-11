'use strict';

module.exports = function (app) {
    var console = process.console;

    var express = require('express'),
        passport = require('passport'),
        furnaceRouter = express.Router(),
        utils = require('../modules/utils'),
        gameResources = require('../modules/gameResources'),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose');

    //**************** FURNACE ROUTER **********************
    //Middleware para estas rutas
    furnaceRouter.use(bodyParser.json());
    furnaceRouter.use(passport.authenticate('bearer', {
        session: false,
        failureRedirect: '/error/session'
    }));

    /**
     * POST /furnace/tostem
     * Combina dos tostem en el Horno. Requiere los siguientes parámetros en el cuerpo del POST:
     * inventory_a: id de inventario del tostem A; inventory_b: id de inventario del tostem B
     */
    furnaceRouter.post('/tostem', function (req, res, next) {
        // El objeto user
        var usuario = req.user,
            params = req.body,
            idTostemA = params.inventory_a, tostemA,
            idTostemB = params.inventory_b, tostemB,
            newTostemList = [],
            respuesta = {
                success: null,
                generatedTostem: null
            };

        // Compruebo el estado de la partida, si es 1. Si no, error
        if (usuario.game.gamedata.status !== 1) {
            console.tag('FURNACE-TOSTEM').error('No se permite esta acción en el estado actual de la partida');
            res.redirect('/error/errGameStatusNotAllowed');
            return;
        }

        // Si no me mandan ambos ids fuera
        if (!idTostemA || !idTostemB) {
            console.tag('FURNACE-TOSTEM').error('No se han enviado ambos tostem a meter al horno');
            res.redirect('/error/errFurnaceTostemNoTostems');
            return;
        }

        // Si me mandan los id por duplicado fuera
        if (idTostemA === idTostemB) {
            console.tag('FURNACE-TOSTEM').error('Ambos id de tostem son el mismo');
            res.redirect('/error/errFurnaceTostemSameTostem');
            return;
        }

        // Saco los tostem del objeto usuario y dejo el resto en un nuevo array
        usuario.game.inventory.tostems.forEach(function (tostem) {
            if (tostem.id === idTostemA) {
                tostemA = tostem;
            } else if (tostem.id === idTostemB) {
                tostemB = tostem;
            } else {
                newTostemList.push(tostem);
            }
        });

        // Si no he encontrado ambos, mal rollo
        if (!tostemA || !tostemB) {
            console.tag('FURNACE-TOSTEM').error('No se han encontrado ambos tostem en el inventario del usuario');
            res.redirect('/error/errFurnaceTostemNotFound');
            return;
        }

        // Verifico que ambos no están equipados, o mal rollo again
        if (tostemA.in_use || tostemB.in_use) {
            console.tag('FURNACE-TOSTEM').error('Alguno de los tostem estaba equipado actualmente');
            res.redirect('/error/errFurnaceTostemAnyEquipped');
            return;
        }

        // Calculo el porcentaje de fracaso en función de los niveles de los tostem
        // 15% por cada nivel de diferencia entre uno y otro tostem
        var fracaso = Math.abs(tostemA.level - tostemB.level) * 15;

        // Miro a ver si tengo éxito al fusionar el tostem
        if (utils.dice100(fracaso)) {
            // Éxito. Calculo el elemento del tostem final
            var elemento = null;
            if (tostemA.type === tostemB.type) {
                elemento = tostemA.type;
            }

            // Creo el nuevo tostem
            var newTostem = gameResources.getRandomTostem(Math.max(tostemA.level, tostemB.level) + 1, elemento);

            // Guardo el nuevo tostem en la lista nueva
            newTostemList.push(newTostem);

            // La respuesta para el frontend
            respuesta.success = true;
            respuesta.generatedTostem = newTostem;
        } else {
            // Fracaso. Recupero uno de los dos tostem: el de más nivel o uno aleatorio en caso de empate
            var tostemRecuperado;

            if (tostemA.level > tostemB.level) {
                tostemRecuperado = tostemA;
            } else if (tostemA.level < tostemB.level) {
                tostemRecuperado = tostemB;
            } else {
                // Aleatoriamente devuelvo uno u otro
                if (utils.randomInt(0, 1)) {
                    tostemRecuperado = tostemA;
                } else {
                    tostemRecuperado = tostemB;
                }
            }

            // Guardo el tostem recuperado en la lista de tostems nueva
            newTostemList.push(tostemRecuperado);

            // La respuesta para el frontend
            respuesta.success = false;
            respuesta.generatedTostem = tostemRecuperado;
        }

        // Guardo la nueva lista de tostems del usuario
        usuario.game.inventory.tostems = newTostemList;
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


    /**
     * POST /furnace/rune
     * Combina dos runas en el Horno. Requiere los siguientes parámetros en el cuerpo del POST:
     * inventory_a: id de inventario de la runa A; inventory_b: id de inventario de la runa B
     */
    furnaceRouter.post('/rune', function (req, res, next) {
        // El objeto user
        var usuario = req.user,
            params = req.body,
            idRuneA = params.inventory_a, runeA = null,
            idRuneB = params.inventory_b, runeB = null,
            newRuneList = [],
            respuesta = {
                success: null,
                upgraded: false,
                generatedRune: null
            };

        // Compruebo el estado de la partida, si es 1. Si no, error
        if (usuario.game.gamedata.status !== 1) {
            console.tag('FURNACE-TOSTEM').error('No se permite esta acción en el estado actual de la partida');
            res.redirect('/error/errGameStatusNotAllowed');
            return;
        }

        // Si no me mandan ambos ids fuera
        if (!idRuneA || !idRuneB) {
            console.tag('FURNACE-RUNE').error('No se han enviado ambas runas a meter al horno');
            res.redirect('/error/errFurnaceRuneNoRunes');
            return;
        }

        // Si me mandan los id por duplicado fuera
        if (idRuneA === idRuneB) {
            console.tag('FURNACE-RUNE').error('Ambos id de runa son el mismo');
            res.redirect('/error/errFurnaceRuneSameRune');
            return;
        }

        // Saco las runas del objeto usuario y dejo el resto en un nuevo array
        usuario.game.inventory.runes.forEach(function (rune) {
            if (rune.id === idRuneA) {
                runeA = rune;
            } else if (rune.id === idRuneB) {
                runeB = rune;
            } else {
                newRuneList.push(rune);
            }
        });

        // Si no he encontrado ambos, mal rollo
        if (!runeA || !runeB) {
            console.tag('FURNACE-RUNE').error('No se han encontrado ambas runas en el inventario del usuario');
            res.redirect('/error/errFurnaceRuneNotFound');
            return;
        }

        // Verifico que ambos no están equipados, o mal rollo again
        if (runeA.in_use || runeB.in_use) {
            console.tag('FURNACE-RUNE').error('Alguno de las runas estaba equipada actualmente');
            res.redirect('/error/errFurnaceRuneAnyEquipped');
            return;
        }

        // Calculo el porcentaje de fracaso en función de los niveles de las runas
        // 10% de base y luego 10% más por cada nivel de diferencia de rareza entre una y otra runa
        var fracaso = 10 + ( Math.abs(gameResources.frecuenciesToNumber[runeA.frecuency] - gameResources.frecuenciesToNumber[runeB.frecuency]) * 10 );

        // Hago unos cálculos para saber la frecuencia más alta y otras cosas
        var runeRecuperado, sameFrecuency = false, maxFrecuency;
        if (gameResources.frecuenciesToNumber[runeA.frecuency] > gameResources.frecuenciesToNumber[runeB.frecuency]) {
            runeRecuperado = runeA;
            maxFrecuency = runeA.frecuency;
        } else if (gameResources.frecuenciesToNumber[runeA.frecuency] < gameResources.frecuenciesToNumber[runeB.frecuency]) {
            runeRecuperado = runeB;
            maxFrecuency = runeB.frecuency;
        } else {
            // Tienen la misma frecuencia
            sameFrecuency = true;
            maxFrecuency = runeA.frecuency;

            // Aleatoriamente devuelvo uno u otro
            if (utils.randomInt(0, 1)) {
                runeRecuperado = runeA;
            } else {
                runeRecuperado = runeB;
            }
        }

        // Miro a ver si tengo éxito al fusionar la runa
        if (utils.dice100(fracaso)) {
            var newRune,
                frecuency = maxFrecuency;


            // Si son de la misma frecuencia puede que suban
            if (sameFrecuency) {
                // Calculo el % de que suba de nivel la runa generada
                var failUpgrade = 100 - gameResources.RUNE_UPGRADE[maxFrecuency];

                // Miro a ver si sube o no de nivel
                if (utils.dice100(failUpgrade)) {
                    // Sube de nivel !!
                    frecuency = gameResources.upgradeFrecuency(maxFrecuency);
                    respuesta.upgraded = true;
                }
            } else {
            }

            // La nueva runa es una aleatoria de la frecuencia que he calculado
            newRune = gameResources.getRandomRune(frecuency);

            // Guardo la nueva runa en la lista nueva
            newRuneList.push(newRune);

            // La respuesta para el frontend
            respuesta.success = true;
            respuesta.generatedRune = newRune;
        } else {
            // Fracaso. Recupero una de las dos runas: el de más nivel de rareza o uno aleatorio en caso de empate
            // Ya hice estos cálculos antes
            // Guardo la runa recuperado en la lista de runas nueva
            newRuneList.push(runeRecuperado);

            // La respuesta para el frontend
            respuesta.success = false;
            respuesta.generatedRune = runeRecuperado;
        }

        // Guardo la nueva lista de runas del usuario
        usuario.game.inventory.runes = newRuneList;
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
    app.use('/furnace', furnaceRouter);
};
