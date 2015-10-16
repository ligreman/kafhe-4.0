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

    // Asigno los router a sus rutas
    app.use('/mongo/fake', pruebaRouter);


    //Eventos
    eventEmitter.once('connection', function (stream) {
        console.log('Ah, we have our first user!');
    });


    eventEmitter.emit('connection', {});

};

//Use new Aggregate({ $match: { _id: mongoose.Schema.Types.ObjectId('00000000000000000000000a') } }); instead.
