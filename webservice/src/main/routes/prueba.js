'use strict';

module.exports = function (app) {
    var console = process.console;

    var express      = require('express'),
        passport     = require('passport'),
        //bodyParser   = require('body-parser'),
        //urlencodedParser = bodyParser.urlencoded({extended: false}),
        pruebaRouter = express.Router(),
        failRouter   = express.Router();

    //**************** LOGIN ROUTER **********************
    //Middleware para estas rutas
    //pruebaRouter.use(urlencodedParser);
    pruebaRouter.use(passport.authenticate('bearer', {
        session: false,
        //successRedirect: '/ok',
        failureRedirect: '/failete'
    }));
    //Si se hace login correctamente, pasar� aqu�
    pruebaRouter.get('/', function (req, res, next) {
        console.log("POST");
        console.log(req.user);
        console.log(req.authInfo);
        res.json({message: 'Welcome again pesao', user: req.user});
    });

    //**************** LOGIN FAIL ROUTER **********************
    //GET sobre el ra�z del failete router (es decir sobre /failete)
    failRouter.get('/', function (req, res, next) {
        console.log("FAILETE");
        res.json({login: 'failete'});
    });

    // Asigno los router a sus rutas
    app.use('/prueba', pruebaRouter);
    app.use('/failete', failRouter);
};