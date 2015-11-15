'use strict';

//Cargo los módulos que voy a usar y los inicializo
var express   = require('express'),
    //cors      = require('cors'),
    app       = express(),
    validator = require('validator'),
    mongoose  = require('mongoose'),
    Q         = require('q');

var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 8080,
    serverHost = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
    mongoHost  = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME || 'mongodb://localhost/kafhe';

// CORS
/*
 var corsOptions = {
 origin: 'http://localhost'
 };
 app.use(cors(corsOptions));
 */

// LOGS
var scribe  = require('scribe-js')(), //loads Scribe
    console = process.console;
app.use(scribe.express.logger()); //Log each request
app.use('/logs', scribe.webPanel()); //Log web console

Q.longStackSupport = true;
/*
 // With log(...)
 console.log("Hello World!");
 console.info("Hello World!");
 console.error("Hello World!");
 console.warning("Hello World!");
 // Now with an Object
 console.log({hello: "world"});
 //Now with tag
 console.tag("Demo").log("Hello all");
 */


//Cargo mis módulos internos
//var utils = require('./modules/utils');

//Cargo los modelos de Mongo
//var modelos = require('./models/user');

//Configuración de la conexión a Mongo
mongoose.connect(mongoHost, {
    //user: 'myUserName',
    //pass: 'myPassword'
});

//Creo los modelos de Mongo. Sólo he de hacerlo una vez
require('./models/createModels')(mongoose);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function (callback) {
    console.log("Mongo conectado");
});
mongoose.set('debug', true);


//Cargo las rutas y estrategias
require('./routes/routes')(app);


// Configuro los validadores propios
validator.extend('isValidString', function (str) {
    return /^[a-zA-Z0-9ñáéíóúÁÉÍÓÚüÜ\-_ ]+$/.test(str);
});

//Configuración de los middleware de la aplicación
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json());
//app.use(passport.initialize());


//Capturo los errores no controlados para devolver un json de error al usuario (esto ha de ser el último .use de todos)
// TODO mirar esto de los errores si puedo loggearlos, porque esto se los zampa
/*app.use(function (err, req, res, next) {
 console.error(err);
 var msg = 'SERVER ERROR',
 error;

 try {
 console.log(err);
 error = JSON.parse(err);
 console.log(error);
 } catch (error) {
 console.log("E: " + error);
 }

 if (error && error.json) {
 console.log("json");
 msg = error.json;
 }

 res.status(500).send(msg);
 });*/

//Controlamos el cierre para desconectar mongo
process.stdin.resume();//so the program will not close instantly
//do something when app is closing, catches ctrl+c event
process.on('exit', exitHandler.bind(null, {closeMongo: true, exit: true, msg: 'exit'}));
process.on('SIGINT', exitHandler.bind(null, {closeMongo: true, exit: true, msg: 'SIGINT'}));
process.on('SIGTERM', exitHandler.bind(null, {closeMongo: true, exit: true, msg: 'SIGTERM'}));


function exitHandler(options, err) {
    console.log('Salgo ' + options.msg + '. Error: ' + err);
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

