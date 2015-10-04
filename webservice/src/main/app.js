'use strict';

//Cargo los módulos que voy a usar y los inicializo
var express  = require('express'),
    app      = express(),
    mongoose = require('mongoose');

var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 8080,
    serverHost = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    mongoHost  = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME || 'mongodb://localhost/kafhe';

//Cargo mis módulos internos
//var utils = require('./modules/utils');

//Cargo los modelos de Mongo
//var modelos = require('./models/user');

//Configuración de la conexión a Mongo
mongoose.connect(mongoHost, {
    //user: 'myUserName',
    //pass: 'myPassword'
});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function (callback) {
    console.log("Mongo conectado");
});
mongoose.set('debug', true);


//Cargo las rutas y estrategias
require('./routes/routes')(app);


//Configuración de los middleware de la aplicación
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json());
//app.use(passport.initialize());

//Capturo los errores no controlados para devolver un json de error al usuario (esto ha de ser el último .use de todos)
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
//Si salta alguna excepción rara, saco error en vez de cerrar la aplicación. Creo que es redundante con el anterior
/*process.on('uncaughtException', function (err) {
 console.log("ERROR - " + err);
 });*/

//Controlamos el cierre para desconectar mongo
process.stdin.resume();//so the program will not close instantly
//do something when app is closing, catches ctrl+c event
process.on('exit', exitHandler.bind(null, {closeMongo: true, exit: true}));
process.on('SIGINT', exitHandler.bind(null, {closeMongo: true, exit: true}));
process.on('SIGTERM', exitHandler.bind(null, {closeMongo: true, exit: true}));


function exitHandler(options, err) {
    if (options.closeMongo) {
        mongoose.disconnect();
    }
    if (options.exit) {
        process.exit();
    }
}

//Arranco el servidor
var server = app.listen(serverPort, serverHost, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Servidor escuchando en http://%s:%s', host, port);
});

