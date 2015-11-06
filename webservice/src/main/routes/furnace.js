'use strict';

module.exports = function (app) {
    var console = process.console;

    var express       = require('express'),
        passport      = require('passport'),
        validator     = require('validator'),
        furnaceRouter = express.Router(),
        utils         = require('../modules/utils'),
        gameResources = require('../modules/gameResources'),
        bodyParser    = require('body-parser'),
        mongoose      = require('mongoose');

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
        var usuario       = req.user,
            params        = req.body,
            idTostemA     = params.inventory_a, tostemA,
            idTostemB     = params.inventory_b, tostemB,
            newTostemList = [];

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

        console.log(tostemA);
        console.log(tostemB);

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
            var elemento;

            if (tostemA.element === tostemB.element) {
                elemento = tostemA.element;
            } else {
                elemento = gameResources.getRandomElement();
            }

            // Creo el nuevo tostem
            var newTostem = {
                id: utils.generateId(),
                type: elemento,
                level: Math.max(tostemA.level, tostemB.level) + 1,
                equipped: false
            };

            // Guardo el nuevo tostem en la lista nueva
            newTostemList.push(newTostem);
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
    });

    // Asigno los router a sus rutas
    app.use('/furnace', furnaceRouter);
};
