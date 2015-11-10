'use strict';

/*
 Forja un arma en la forja.

 **Parámetros**

 - idInventoryA: id de la runa
 - idInventoryB: id del tostem
 - class: la clase de arma a forjar (cortante, contundente o perforante)

 **Reglas**

 - Necesitas 1 piedra de forja para forjar algo.
 - La runa y tostem deben estar en tu inventario y no deben estar equipadas.
 - La clase ha de se una de las factibles.
 - El elemento del arma es el del tostem elegido.
 - Las skills salen del tostem.
 - Los stats salen de un calculo de valores base y porcentajes de la runa.
 - La rareza de momento no la usaré, así que pongo común a todo por defecto.
 - Nivel equipo = nivel tostem * rareza runa

 **Otros**

 Necesitaré una lista de nombres de armas de cada clase (lanza, espada, etc...) para elegir aleatoriamente.
 */

module.exports = function (app) {
    var console = process.console;

    var express = require('express'),
        passport = require('passport'),
    //validator = require('validator'),
        forgeRouter = express.Router(),
    //utils = require('../modules/utils'),
    //gameResources = require('../modules/gameResources'),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose');

    //**************** FURNACE ROUTER **********************
    //Middleware para estas rutas
    forgeRouter.use(bodyParser.json());
    forgeRouter.use(passport.authenticate('bearer', {
        session: false,
        failureRedirect: '/error/session'
    }));

    /**
     * POST /furnace/tostem
     * Combina dos tostem en el Horno. Requiere los siguientes parámetros en el cuerpo del POST:
     * inventory_a: id de inventario del tostem A; inventory_b: id de inventario del tostem B
     */
    forgeRouter.post('/weapon', function (req, res, next) {
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
        if (tostemA.equipped || tostemB.equipped) {
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

    // Asigno los router a sus rutas
    app.use('/forge', forgeRouter);
};
