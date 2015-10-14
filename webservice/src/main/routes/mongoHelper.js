'use strict';

module.exports = function (app) {
    var console = process.console;

    var express      = require('express'),
        passport     = require('passport'),
        events       = require('events'),
        eventEmitter = new events.EventEmitter(),
        pruebaRouter = express.Router(),
        mongoose     = require('mongoose'),
        models       = require('../models/models')(mongoose);
    /**
     * 1 meter meals
     * 2 meter drinks
     * 3 meter skills
     * 4 crear partida
     * 5 crear usuarios
     * 6 actualizar partida con ids de usuarios
     */

        // Genera modelos de mongo
    pruebaRouter.get('/user/:count', function (req, res, next) {
        var cuantos = req.params.count;
        var fakery = require('mongoose-fakery');

        var userFakery = fakery.fake('user');
        fakery.fake('user', models.User, {
            username: fakery.g.name(),
            password: "1267ea54d8dc193b000d4a86487c7d38b7a55e43",
            alias: fakery.g.surname()
        });

        console.log(userFakery);

        if (!cuantos) {
            cuantos = 1;
        }

        //Limpio la colección antes
        var ids = [];
        models.User.remove({}, function (err) {
            //Meto los nuevos valores
            for (var i = 1; i <= cuantos; i++) {
                fakery.makeAndSave('user', {username: 'pepe' + i, 'game.level': i}, function (err, user) {
                    console.log('Creado usuario: ' + user.username + ' - ' + user._id);
                    ids.push(user._id);

                    //Termino
                    if (user.game.level == cuantos) {
                        console.log(JSON.stringify(ids));
                        res.json({"mongo": true, "users_created": ids});
                    }
                });
            }
        });
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
