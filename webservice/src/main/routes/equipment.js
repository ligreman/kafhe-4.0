'use strict';

module.exports = function (app) {
    var console = process.console;

    var express         = require('express'),
        passport        = require('passport'),
        validator       = require('validator'),
        utils           = require('../modules/utils'),
        equipmentRouter = express.Router(),
        bodyParser      = require('body-parser'),
        gameResources   = require('../modules/gameResources'),
        TAFFY           = require('taffy'),
        mongoose        = require('mongoose');

    //**************** SKILL ROUTER **********************
    //Middleware para estas rutas
    equipmentRouter.use(bodyParser.json());
    equipmentRouter.use(passport.authenticate('bearer', {
        session: false,
        failureRedirect: '/error/session'
    }));

    /**
     * POST /equipment/equip
     * Equipa un arma o armadura. Requiere este parámetro JSON:
     * inventory_id: id del objeto de inventario que se equipará
     */
    equipmentRouter.post('/equip', function (req, res, next) {
        // El objeto user
        var usuario    = req.user,
            params     = req.body,
            idObject   = null,
            type       = null,
            components = {rune: null, tostem: null};

        // Compruebo el estado de la partida, si es 1. Si no, error
        if (usuario.game.gamedata.status !== 1) {
            console.tag('EQUIPMENT-EQUIP').error('No se permite esta acción en el estado actual de la partida');
            //res.redirect('/error/errGameStatusNotAllowed');
            utils.error(res, 400, 'errGameStatusNotAllowed');
            return;
        }

        // Busco el objeto en el inventario y miro a ver qué tipo de objeto es
        // Busco en armaduras
        var armors = TAFFY(usuario.game.inventory.armors);
        var armor = armors({id: params.inventory_id}).get();

        if (armor.length === 1) {
            type = 'armor';
            idObject = armor[0].id;
            components.rune = armor[0].components.rune;
            components.tostem = armor[0].components.tostem;
        }

        // Busco en armas
        var weapons = TAFFY(usuario.game.inventory.weapons);
        var weapon = weapons({id: params.inventory_id}).get();

        if (weapon.length === 1) {
            type = 'weapon';
            idObject = weapon[0].id;
            components.rune = weapon[0].components.rune;
            components.tostem = weapon[0].components.tostem;
        }

        // Si no lo he encontrado, mal rollo
        if (!idObject) {
            //res.redirect('/error/errEquipNoItem');
            utils.error(res, 400, 'errEquipNoItem');
            return;
        }

        // Compruebo que no tengo nada equipado en ese hueco de objeto
        switch (type) {
            case 'armor':
                // Si no está vacío el hueco, no puedo equiparme
                if (usuario.game.equipment.armor !== null && usuario.game.equipment.armor !== '') {
                    //res.redirect('/error/errEquipNoSpace');
                    utils.error(res, 400, 'errEquipNoSpace');
                    return;
                } else {
                    // Si todo está correcto, equipo el objeto
                    usuario.game.equipment.armor = idObject;

                    // La marco como equipada
                    var newArmors = [];
                    usuario.game.inventory.armors.forEach(function (thisArmor) {
                        // Si es la que busco
                        if (thisArmor.id === idObject) {
                            thisArmor.equipped = true;
                        }
                        newArmors.push(thisArmor);
                    });
                    usuario.game.inventory.armors = newArmors;
                }
                break;
            case 'weapon':
                // Si no está vacío el hueco, no puedo equiparme
                if (usuario.game.equipment.weapon !== null && usuario.game.equipment.weapon !== '') {
                    //res.redirect('/error/errEquipNoSpace');
                    utils.error(res, 400, 'errEquipNoSpace');
                    return;
                } else {
                    // Si todo está correcto, equipo el objeto
                    usuario.game.equipment.weapon = idObject;

                    // La marco como equipada
                    var newWeapons = [];
                    usuario.game.inventory.weapons.forEach(function (thisWeapon) {
                        // Si es la que busco
                        if (thisWeapon.id === idObject) {
                            thisWeapon.equipped = true;
                        }
                        newWeapons.push(thisWeapon);
                    });
                    usuario.game.inventory.weapons = newWeapons;
                }
                break;
        }

        // Equipo los materiales (runa y tostems)
        var newRunes = [], newTostems = [];
        // Runas
        usuario.game.inventory.runes.forEach(function (runa) {
            // Si es la que busco
            if (runa.id === components.rune) {
                runa.in_use = true;
            }
            newRunes.push(runa);
        });
        // Tostems
        usuario.game.inventory.tostems.forEach(function (tostem) {
            // Si es la que busco
            if (tostem.id === components.tostem) {
                tostem.in_use = true;
            }
            newTostems.push(tostem);
        });

        // Actualizo los campos en el objeto usuario
        usuario.game.inventory.runes = newRunes;
        usuario.game.inventory.tostems = newTostems;

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
    });


    /**
     * POST /equipment/destroy
     * Destruye un arma o armadura equipada y recupera los materiales. Requiere este parámetro JSON:
     * inventory_id: id del objeto de inventario que se destruirá
     */
    equipmentRouter.post('/destroy', function (req, res, next) {
        // El objeto user
        var usuario    = req.user,
            params     = req.body,
            idObject   = null,
            components = {rune: null, tostem: null},
            respuesta  = {
                generatedRunes: [],
                generatedTostem: null
            };

        // Compruebo el estado de la partida, si es 1. Si no, error
        if (usuario.game.gamedata.status !== 1) {
            console.tag('EQUIPMENT-EQUIP').error('No se permite esta acción en el estado actual de la partida');
            //res.redirect('/error/errGameStatusNotAllowed');
            utils.error(res, 400, 'errGameStatusNotAllowed');
            return;
        }

        // Miro a ver el objeto cuál de los que tengo equipado es
        // ¿Será la armadura?
        if (usuario.game.equipment.armor === params.inventory_id) {
            // Saco los materiales de esta armadura
            var armors = TAFFY(usuario.game.inventory.armors);
            var armor = armors({id: params.inventory_id}).get();

            if (armor.length === 1) {
                idObject = armor[0].id;
                components.rune = armor[0].components.rune;
                components.tostem = armor[0].components.tostem;

                // Borro el objeto del inventario
                var newArmors = [];
                usuario.game.inventory.armors.forEach(function (thisArmor) {
                    // Si no es la que quiero quitar
                    if (thisArmor.id !== idObject) {
                        newArmors.push(thisArmor);
                    }
                });
                usuario.game.inventory.armors = newArmors;
                usuario.game.equipment.armor = null;
            }
        }

        // ¿Será el arma?
        if (usuario.game.equipment.weapon === params.inventory_id) {
            // Saco los materiales del arma
            var weapons = TAFFY(usuario.game.inventory.weapons);
            var weapon = weapons({id: params.inventory_id}).get();

            if (weapon.length === 1) {
                idObject = weapon[0].id;
                components.rune = weapon[0].components.rune;
                components.tostem = weapon[0].components.tostem;

                // Borro el objeto del inventario
                var newWeapons = [];
                usuario.game.inventory.weapons.forEach(function (thisWeapon) {
                    // Si no es la que quiero quitar
                    if (thisWeapon.id !== idObject) {
                        newWeapons.push(thisWeapon);
                    }
                });
                usuario.game.inventory.weapons = newWeapons;
                usuario.game.equipment.weapon = null;
            }
        }

        // Si no lo he encontrado, mal rollo
        if (!idObject) {
            //res.redirect('/error/errEquipDestroyNotFound');
            utils.error(res, 400, 'errEquipDestroyNotFound');
            return;
        }

        // Recupero las runas y tostems
        var newRunes = [], newTostems = [];
        // Runas. Recupero 2 runas de rareza inferior a la destruída, salvo si es común que recupero 1 común.
        usuario.game.inventory.runes.forEach(function (runa) {
            // Si es la que busco, no la guardo porque es la que he usado
            if (runa.id === components.rune) {
                // Si es una rura común devuelvo una común aleatoria
                if (runa.frecuency === gameResources.FRECUENCIES_TO_STRING[1]) {
                    var frecuency = gameResources.FRECUENCIES_TO_STRING[1];
                    var newRune = gameResources.getRandomRune(frecuency);
                    newRunes.push(newRune);

                    // Para devolver la runa generada al frontend
                    respuesta.generatedRunes.push(newRune);
                }
                // Si no, devuelvo dos de nivel inferior
                else {
                    var frecuency = gameResources.FRECUENCIES_TO_NUMBER[runa.frecuency] - 1;
                    // Necesito la frecuencia en letra
                    frecuency = gameResources.FRECUENCIES_TO_STRING[frecuency];

                    // Genero las dos runas
                    var newRune = gameResources.getRandomRune(frecuency);
                    var newRune2 = gameResources.getRandomRune(frecuency);
                    newRunes.push(newRune);
                    newRunes.push(newRune2);

                    // Para devolver la runa generada al frontend
                    respuesta.generatedRunes.push(newRune);
                    respuesta.generatedRunes.push(newRune2);
                }
            } else {
                newRunes.push(runa);
            }
        });
        // Tostems. Recuperas un tostem de elemento aleatorio de 1 nivel inferior al destruído.
        usuario.game.inventory.tostems.forEach(function (tostem) {
            // Si es el que busco no lo guardo y genero uno nuevo
            if (tostem.id === components.tostem) {
                var nivel = Math.max(tostem.level - 1, 1);

                // Genero un tostem aleatorio nuevo
                var newTostem = gameResources.getRandomTostem(nivel);
                newTostems.push(newTostem);

                // Para devolver el tostem generado al frontend
                respuesta.generatedTostem = newTostem;
            } else {
                newTostems.push(tostem);
            }
        });

        // Actualizo los campos en el objeto usuario
        usuario.game.inventory.runes = newRunes;
        usuario.game.inventory.tostems = newTostems;

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
    app.use('/equipment', equipmentRouter);
};
