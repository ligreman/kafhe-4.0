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

    /******************************* MODELOS ********************************************/
    fakery.fake('user', models.User, {
        username: fakery.g.name(),
        password: "1267ea54d8dc193b000d4a86487c7d38b7a55e43", //paco
        alias: fakery.g.surname()
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
        name: fakery.g.name(),
        ito: fakery.g.rndbool()
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
