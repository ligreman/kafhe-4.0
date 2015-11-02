'use strict';

module.exports = function (app) {
    var console = process.console;

    var express         = require('express'),
        passport        = require('passport'),
        validator       = require('validator'),
        equipmentRouter = express.Router(),
        bodyParser      = require('body-parser'),
        //JSONSelect      = require('JSONSelect'),
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
        var usuario   = req.user,
            params    = req.body,
            idObject  = null,
            type      = null,
            materials = {rune: null, tostem: null};

        // Busco el objeto en el inventario y miro a ver qué tipo de objeto es
        // Busco en armaduras
        var armors = TAFFY(usuario.game.inventory.armors);
        var armor = armors({id: params.inventory_id}).get();

        if (armor.length === 1) {
            type = 'armor';
            idObject = armor[0].id;
            materials.rune = armor[0].materials.rune;
            materials.tostem = armor[0].materials.tostem;
        }

        // Busco en armas
        var weapons = TAFFY(usuario.game.inventory.weapons);
        var weapon = weapons({id: params.inventory_id}).get();

        if (weapon.length === 1) {
            type = 'weapon';
            idObject = weapon[0].id;
            materials.rune = weapon[0].materials.rune;
            materials.tostem = weapon[0].materials.tostem;
        }

        // Si no lo he encontrado, mal rollo
        if (!idObject) {
            res.redirect('/error/errEquip001');
            return;
        }

        // Compruebo que no tengo nada equipado en ese hueco de objeto
        switch (type) {
            case 'armor':
                // Si no está vacío el hueco, no puedo equiparme
                if (usuario.game.equipment.armor !== null && usuario.game.equipment.armor !== '') {
                    res.redirect('/error/errEquip002');
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
                    res.redirect('/error/errEquip002');
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
            if (runa.id === materials.rune) {
                runa.equipped = true;
            }
            newRunes.push(runa);
        });
        // Tostems
        usuario.game.inventory.tostems.forEach(function (tostem) {
            // Si es la que busco
            if (tostem.id === materials.tostem) {
                tostem.equipped = true;
            }
            newTostems.push(tostem);
        });

        // Actualizo los campos en el objeto usuario
        usuario.game.inventory.runes = newRunes;
        usuario.game.inventory.tostems = newTostems;

        // Guardo el usuario
        usuario.save(function (err) {
            if (err) {
                res.redirect('/error');
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
        var usuario   = req.user,
            params    = req.body,
            idObject  = null,
            type      = null,
            materials = {rune: null, tostem: null};

        // Miro a ver el objeto cuál de los que tengo equipado es
        // ¿Será la armadura?
        if (usuario.game.equipment.armor === params.inventory_id) {
            // Saco los materiales de esta armadura
            var armors = TAFFY(usuario.game.inventory.armors);
            var armor = armors({id: params.inventory_id}).get();

            if (armor.length === 1) {
                idObject = armor[0].id;
                type = 'armor';
                materials.rune = armor[0].materials.rune;
                materials.tostem = armor[0].materials.tostem;

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
                type = 'weapon';
                materials.rune = weapon[0].materials.rune;
                materials.tostem = weapon[0].materials.tostem;

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
            res.redirect('/error/errEquipDestroy001');
            return;
        }

        // Desequipo la runa y tostem
        var newRunes = [], newTostems = [];
        // Runas
        usuario.game.inventory.runes.forEach(function (runa) {
            // Si es la que busco
            if (runa.id === materials.rune) {
                runa.equipped = false;
            }
            newRunes.push(runa);
        });
        // Tostems
        usuario.game.inventory.tostems.forEach(function (tostem) {
            // Si es la que busco
            if (tostem.id === materials.tostem) {
                tostem.equipped = false;
            }
            newTostems.push(tostem);
        });

        // Actualizo los campos en el objeto usuario
        usuario.game.inventory.runes = newRunes;
        usuario.game.inventory.tostems = newTostems;

        // Guardo el usuario
        usuario.save(function (err) {
            if (err) {
                res.redirect('/error');
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
    app.use('/equipment', equipmentRouter);
};
