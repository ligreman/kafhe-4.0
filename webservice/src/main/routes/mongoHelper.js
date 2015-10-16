'use strict';

module.exports = function (app) {
    var console = process.console;

    var express      = require('express'),
        passport     = require('passport'),
        events       = require('events'),
        eventEmitter = new events.EventEmitter(),
        pruebaRouter = express.Router(),
        mongoose     = require('mongoose'),
        fakery       = require('mongoose-fakery'),
        models       = require('../models/models')(mongoose);
    /**
     * 1 meter meals
     * 2 meter drinks
     * 3 meter skills
     * 4 crear partida
     * 5 crear usuarios
     * 6 actualizar partida con ids de usuarios
     *
     * una función por cada crear colección nueva
     * una función que vaya pasando por eventos para actualizar las relaciones de ids
     */

    var date = new Date();

    /******************************* MODELOS ********************************************/
    fakery.fake('user', models.User, {
        username: fakery.g.name(),
        password: "1267ea54d8dc193b000d4a86487c7d38b7a55e43", //paco
        alias: fakery.g.surname(),
        leader: fakery.g.rndbool(),
        avatar: fakery.g.str(10),
        game: {
            gamedata: 'FILL-ME',
            level: fakery.g.rndint(1, 10),
            tostolares: fakery.g.rndint(1, 1000),
            stats: {
                life: fakery.g.rndint(1, 100),
                fury: fakery.g.rndint(1, 100),
                fury_mode: fakery.g.rndbool(),
                reputation: fakery.g.rndint(1, 100),
                action_points: fakery.g.rndint(1, 30)
            },
            equipment: {
                weapon: 'w001',
                armor: 'a001'
            },
            inventory: {
                tostems: [
                    {
                        id: 't001',
                        type: fakery.g.pick(['fire', 'water', 'earth', 'light']),
                        level: fakery.g.rndint(1, 10),
                        frecuency: fakery.g.pick(['common', 'uncommon', 'masterwork']),
                        stats: {
                            one: fakery.g.rndint(1, 10),
                            two: fakery.g.rndint(1, 10)
                        },
                        skills: [],
                        equipped: true
                    }, {
                        id: 't002',
                        type: fakery.g.pick(['fire', 'water', 'earth', 'light']),
                        level: fakery.g.rndint(1, 10),
                        frecuency: fakery.g.pick(['common', 'uncommon', 'masterwork']),
                        stats: {
                            one: fakery.g.rndint(1, 10),
                            two: fakery.g.rndint(1, 10)
                        },
                        skills: [],
                        equipped: true
                    }, {
                        id: 't003',
                        type: fakery.g.pick(['fire', 'water', 'earth', 'light']),
                        level: fakery.g.rndint(1, 10),
                        frecuency: fakery.g.pick(['common', 'uncommon', 'masterwork']),
                        stats: {
                            one: fakery.g.rndint(1, 10),
                            two: fakery.g.rndint(1, 10)
                        },
                        skills: [],
                        equipped: true
                    }, {
                        id: 't004',
                        type: fakery.g.pick(['fire', 'water', 'earth', 'light']),
                        level: fakery.g.rndint(1, 10),
                        frecuency: fakery.g.pick(['common', 'uncommon', 'masterwork']),
                        stats: {
                            one: fakery.g.rndint(1, 10),
                            two: fakery.g.rndint(1, 10)
                        },
                        skills: [],
                        equipped: false
                    }, {
                        id: 't005',
                        type: fakery.g.pick(['fire', 'water', 'earth', 'light']),
                        level: fakery.g.rndint(1, 10),
                        frecuency: fakery.g.pick(['common', 'uncommon', 'masterwork']),
                        stats: {
                            one: fakery.g.rndint(1, 10),
                            two: fakery.g.rndint(1, 10)
                        },
                        skills: [],
                        equipped: false
                    }
                ],
                runes: [
                    {
                        id: 'r001',
                        type: fakery.g.pick(['wood', 'iron', 'steel', 'mithril']),
                        level: fakery.g.rndint(1, 10),
                        frecuency: fakery.g.pick(['common', 'uncommon', 'masterwork']),
                        stats: {
                            damage: fakery.g.rndint(1, 10),
                            precision: fakery.g.rndint(1, 10),
                            protection: fakery.g.rndint(1, 10),
                            parry: fakery.g.rndint(1, 10)
                        },
                        equipped: true
                    }, {
                        id: 'r002',
                        type: fakery.g.pick(['wood', 'iron', 'steel', 'mithril']),
                        level: fakery.g.rndint(1, 10),
                        frecuency: fakery.g.pick(['common', 'uncommon', 'masterwork']),
                        stats: {
                            damage: fakery.g.rndint(1, 10),
                            precision: fakery.g.rndint(1, 10),
                            protection: fakery.g.rndint(1, 10),
                            parry: fakery.g.rndint(1, 10)
                        },
                        equipped: true
                    }, {
                        id: 'r003',
                        type: fakery.g.pick(['wood', 'iron', 'steel', 'mithril']),
                        level: fakery.g.rndint(1, 10),
                        frecuency: fakery.g.pick(['common', 'uncommon', 'masterwork']),
                        stats: {
                            damage: fakery.g.rndint(1, 10),
                            precision: fakery.g.rndint(1, 10),
                            protection: fakery.g.rndint(1, 10),
                            parry: fakery.g.rndint(1, 10)
                        },
                        equipped: true
                    }, {
                        id: 'r004',
                        type: fakery.g.pick(['wood', 'iron', 'steel', 'mithril']),
                        level: fakery.g.rndint(1, 10),
                        frecuency: fakery.g.pick(['common', 'uncommon', 'masterwork']),
                        stats: {
                            damage: fakery.g.rndint(1, 10),
                            precision: fakery.g.rndint(1, 10),
                            protection: fakery.g.rndint(1, 10),
                            parry: fakery.g.rndint(1, 10)
                        },
                        equipped: false
                    }
                ],
                weapons: [
                    {
                        id: 'w001',
                        name: fakery.g.surname(),
                        frecuency: fakery.g.pick(['common', 'legendary']),
                        stats: {
                            damage: fakery.g.rndint(1, 10),
                            precision: fakery.g.rndint(1, 10)
                        },
                        materials: {
                            rune: 'r001',
                            tostem: 't001'
                        },
                        skills: [],
                        equipped: true
                    }, {
                        id: 'w002',
                        name: fakery.g.surname(),
                        frecuency: fakery.g.pick(['common', 'legendary']),
                        stats: {
                            damage: fakery.g.rndint(1, 10),
                            precision: fakery.g.rndint(1, 10)
                        },
                        materials: {
                            rune: 'r002',
                            tostem: 't002'
                        },
                        skills: [],
                        equipped: false
                    }
                ],
                armors: [{
                    id: 'a001',
                    name: fakery.g.surname(),
                    frecuency: fakery.g.pick(['common', 'legendary']),
                    stats: {
                        protection: fakery.g.rndint(1, 10),
                        parry: fakery.g.rndint(1, 10)
                    },
                    materials: {
                        rune: 'r003',
                        tostem: 't003'
                    },
                    skills: [],
                    equipped: true
                }],
                stones: fakery.g.rndint(1, 10)
            },
            afk: fakery.g.rndbool(),
            last_activity: date.getTime(),
            order: {
                meal: 'FILL-ME',
                drink: 'FILL-ME',
                ito: fakery.g.rndbool()
            },
            last_order: {
                meal: '',
                drink: '',
                ito: fakery.g.rndbool()
            }
        }
    });

    fakery.fake('meal', models.Meal, {
        name: fakery.g.name(),
        ito: fakery.g.rndbool()
    });

    fakery.fake('drink', models.Drink, {
        name: fakery.g.name(),
        ito: fakery.g.rndbool()
    });

    fakery.fake('skill', models.Skill, {
        name: fakery.g.name(),
        element: fakery.g.pick(['water', 'earth', 'fire', 'light']),
        equipment: fakery.g.pick(['weapon', 'armor'])
    });

    fakery.fake('game', models.Game, {
        status: 0,
        caller: 0,
        players: [],
        notifications: [
            {
                message: fakery.g.lorem(50),
                timestamp: date.getTime() + 10000
            }, {
                message: fakery.g.lorem(50),
                timestamp: date.getTime() + 1000
            }, {
                message: fakery.g.lorem(50),
                timestamp: date.getTime() + 100
            }, {
                message: fakery.g.lorem(50),
                timestamp: date.getTime() + 10
            }
        ],
        repeat: 'week'
    });

    /******************************* GENERADORES ********************************************/
        // 1 Meals
    pruebaRouter.get('/meal', function (req, res, next) {
        var cuantos = 10, van = 0, ids = [];

        models.Meal.remove({}, function (e) {
            for (var i = 1; i <= cuantos; i++) {
                fakery.makeAndSave('meal', {}, function (err, meal) {
                    ids.push(meal._id);
                    cuentaCuentos();
                });
            }
        });

        function cuentaCuentos() {
            van++;
            console.log("Y van " + van);
            if (van === cuantos) {
                res.json({"mongo": true, "meals_created": ids});
            }
        }
    });

    // 2 Drinks
    pruebaRouter.get('/drink', function (req, res, next) {
        var cuantos = 10, van = 0, ids = [];

        models.Drink.remove({}, function (e) {
            for (var i = 1; i <= cuantos; i++) {
                fakery.makeAndSave('meal', {}, function (err, drink) {
                    ids.push(drink._id);
                    cuentaCuentos();
                });
            }
        });

        function cuentaCuentos() {
            van++;
            console.log("Y van " + van);
            if (van === cuantos) {
                res.json({"mongo": true, "drinks_created": ids});
            }
        }
    });

    // Genera modelos de mongo
    pruebaRouter.get('/user/:count', function (req, res, next) {
        var cuantos = req.params.count, van = 0, ids = [];

        if (!cuantos) {
            cuantos = 1;
        }

        //Limpio la colección antes
        models.User.remove({}, function (err) {
            //Meto los nuevos valores
            for (var i = 1; i <= cuantos; i++) {
                fakery.makeAndSave('user', {username: 'pepe' + i}, function (err, user) {
                    ids.push(user._id);
                    cuentaCuentos();
                });
            }
        });

        function cuentaCuentos() {
            van++;
            console.log("Y van " + van);
            if (van === cuantos) {
                res.json({"mongo": true, "users_created": ids});
            }
        }
    });
    // Asigno los router a sus rutas
    app.use('/mongo/fake', pruebaRouter);


    //Eventos
    eventEmitter.once('connection', function (stream) {
        console.log('Ah, we have our first user!');
    });


    eventEmitter.emit('connection', {});

};

//Use new Aggregate({ $match: { _id: mongoose.Schema.Types.ObjectId('00000000000000000000000a') } }); instead.
