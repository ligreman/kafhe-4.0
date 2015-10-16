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

    // Modelos
    var meals = [
        {name: 'Plátano', ito: false},
        {name: 'Bocata', ito: true},
        {name: 'Salchicha', ito: true},
        {name: 'Tortilla con chorizo', ito: true},
        {name: 'Tortilla con cebolla', ito: true},
        {name: 'Pulga de pollo queso', ito: true},
        {name: 'Pulga de perro asado', ito: true},
        {name: 'Peperoni', ito: false}
    ];

    var drinks = [
        {name: 'Té con leche', ito: false},
        {name: 'Café con leche', ito: true},
        {name: 'Té americano', ito: true},
        {name: 'Zumo de pera', ito: true}
    ];

    var skills = [
        {name: 'Ataque de pértiga', element: 'Salchichonio', equipment: 'weapon'},
        {name: 'Bola de patatas', element: 'Fuego', equipment: 'weapon'},
        {name: 'Que te pego leche', element: 'Hielo', equipment: 'armor'},
        {name: 'Jarl', element: 'Escarcha', equipment: 'armor'},
        {name: 'Mira qué te meto', element: 'Moco', equipment: 'weapon'}
    ];

    var d = new Date();
    var game = {
        repeat: true,
        status: 0,
        caller: null,
        players: null,
        notifications: [
            {
                message: 'orem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id augue odio. Integer luctus, lacus nec facilisis euismod, diam nisl auctor lorem, eleifend imperdiet urna nunc et velit. Maecenas mollis in urna vitae accumsan. Pellentesque viverra odio id nisl lacinia, nec pharetra nunc ullamcorper. Ut laoreet, nibh eu accumsan lacinia, tellus sem lacinia ante, id bibendum ante metus ut nunc.',
                timestamp: d.getTime() + 10000
            }, {
                message: 'orem ipsum dolor sit er luctus, lacus nec facilend imperdiet urna nunc et velit. Maecenas mollis in urna vitae accumsan. Pellentesque viverra odio id nisl lacinia, nec pharetra nunc ullamcorper. Ut laoreet, nibh eu accumsan lacinia, tellus sem lacinia ante, id bibendum ante metus ut nunc.',
                timestamp: d.getTime() + 1000
            }, {
                message: 'orem ipsum dolor sit amet, consecteer luctus, lacus ne auctor lorem, eleifend imperdiet urna nunc et velit. Maecenas mollis in urna vitae accumsan. Pellentesque viverra odio id nisl lacinia, nec pharetra nunc ullamcorper. Ut laoreet, nibh eu accumsan lacinia, tellus sem lacinia ante, id bibendum ante metus ut nunc.',
                timestamp: d.getTime() + 1000
            }, {
                message: 'orem elit. Morbi id augue odio. Integer luctus, lei vitae accumsan. Pellentesque viverra odio id nisl lacinia, nec pharetra nunc ullamcorper. Ut laoreet, nibh eu accumsan lacinia, tellus sem lacinia ante, id bibendum ante metus ut nunc.',
                timestamp: d.getTime() + 1000
            }
        ]
    };

    var users = [];


    pruebaRouter.get('/', function (req, res, next) {
        //Limpio la colección antes
        models.Meal.remove({}, function (err) {
            //Meto los nuevos valores
            models.Meal.create(meals, function (err, meals) {
                //res.json({"mongo": true, meals: meals});
                eventEmitter.emit('#2', {
                    res: res,
                    meals: meals
                });

            });
        });
    });


    //Eventos
    eventEmitter.once('#2', function (data) {
        models.Drink.remove({}, function (err) {
            //Meto los nuevos valores
            models.Drink.create(drinks, function (err, drinks) {
                //res.json({"mongo": true, meals: meals});
                eventEmitter.emit('#3', {
                    res: data.res,
                    meals: data.meals,
                    drinks: drinks
                });

            });
        });
    });

    eventEmitter.once('#3', function (data) {
        models.Skill.remove({}, function (err) {
            //Meto los nuevos valores
            models.Skill.create(skills, function (err, skills) {
                //res.json({"mongo": true, meals: meals});
                eventEmitter.emit('#4', {
                    res: data.res,
                    meals: data.meals,
                    drinks: data.drinks,
                    skills: skills
                });

            });
        });
    });

    eventEmitter.once('#4', function (data) {
        models.Game.remove({}, function (err) {
            console.log(err);
            //Meto los nuevos valores
            models.Game.create(game, function (err, game) {
                console.log(err);

                eventEmitter.emit('#5', {
                    res: data.res,
                    meals: data.meals,
                    drinks: data.drinks,
                    skills: data.skills,
                    game: game
                });

            });
        });
    });

    eventEmitter.once('#5', function (data) {
        models.User.remove({}, function (err) {
            //Meto los nuevos valores
            models.User.create(skills, function (err, users) {
                //res.json({"mongo": true, meals: meals});
                eventEmitter.emit('#6', {
                    res: data.res,
                    meals: data.meals,
                    drinks: data.drinks,
                    skills: data.skills,
                    game: data.game,
                    users: users
                });

            });
        });
    });

    eventEmitter.once('#6', function (data) {
        var arrPla = [];

        data.users.forEach(function (user) {
            arrPla.push(user._id);
        });

        models.Game.update({}, {$set: {"players": arrPla}}, function (err) {
            console.log(err);
            eventEmitter.emit('#7', data);
        });
    });

    eventEmitter.once('#7', function (data) {
        models.User.update({}, {
            $set: {
                "game.gamedata": data.game._id,
                "game.order.meal": data.meals[0]._id,
                "game.order.drink": data.drinks[0]._id
            }
        }, function (err) {
            console.log(err);

            res.json({"mongo": true});
        });
    });

    // Asigno los router a sus rutas
    app.use('/mongo/fake', pruebaRouter);


};

//Use new Aggregate({ $match: { _id: mongoose.Schema.Types.ObjectId('00000000000000000000000a') } }); instead.
