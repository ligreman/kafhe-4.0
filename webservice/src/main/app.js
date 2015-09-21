'use strict';

//Cargo los módulos que voy a usar y los inicializo
var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    utils = require('./modules/utils');

//Configuración de la conexión a Mongo
mongoose.connect('mongodb://localhost/kafhe', {
    //user: 'myUserName',
    //pass: 'myPassword'
});

//Configuración de sesión
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 30000}
}));

//Método /api/hola del servicio REST que devuelve un JSON
app.get('/api/hola', function (req, res) {
    console.log(req.session);
    var respuesta = {
        "info": utils.getRespuesta('Pepe'),
        "error": null
    };

    if (!req.session.variable) {
        req.session.variable = 'Adios don José ' + Math.random();
        respuesta.pepe = 'No sé qué decir';
    } else {
        console.log(req.session.variable);
        respuesta.pepe = req.session.variable;
    }

    res.set('Content-Type', 'application/json');
    res.json(respuesta);
});

//Cualquier otra ruta a la que se acceda, devuelve error
app.get('/*', function (req, res) {
    res.status(404).send('Aquí no hay nada');
});

//Arranco el servidor
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Servidor escuchando en http://%s:%s', host, port);
});
