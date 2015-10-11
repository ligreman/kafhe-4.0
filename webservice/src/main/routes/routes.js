'use strict';

module.exports = function (app) {
    var console = process.console,
        express = require('express'),
        router  = express.Router();

    //Cargo las estrategias de las rutas
    require('./strategies')(app);

    //Cargo los diferentes ficheros de rutas
    require('./login')(app);
    require('./prueba')(app);

    // Ruta de error general

    //Cualquier otra ruta a la que se acceda, devuelve error
    app.get('/!*', function (req, res) {
        res.status(404).send('Aquí no hay nada');
    });
};