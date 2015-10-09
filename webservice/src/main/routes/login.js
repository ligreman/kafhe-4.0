'use strict';

module.exports = function (app) {
    var console = process.console;

    var express          = require('express'),
        passport         = require('passport'),
        bodyParser       = require('body-parser'),
        Q                = require('q'),
        urlencodedParser = bodyParser.urlencoded({extended: false}),
        sessionUtils     = require('../modules/sessionUtils'),
        loginRouter      = express.Router(),
        logoutRouter     = express.Router(),
        failRouter       = express.Router();

    //**************** LOGIN ROUTER **********************
    //Middleware para estas rutas
    loginRouter.use(urlencodedParser);
    loginRouter.use(passport.authenticate('local', {
        session: false,
        //successRedirect: '/ok',
        failureRedirect: '/fail'
    }));
    //Si se hace login correctamente, pasará aquí
    loginRouter.post('/', function (req, res, next) {
        console.log("POST");
        console.log(req.user);
        console.log(req.authInfo);
        res.json({
            "login": true,
            "session": {
                "access_token": req.authInfo.access_token
            }
        });
    });

    //**************** LOGOUT ROUTER **********************
    logoutRouter.use(passport.authenticate('bearer', {
        session: false,
        failureRedirect: '/fail'
    }));
    logoutRouter.get('/', function (req, res, next) {
        // Una vez identificado con el token, hago logout borrando la sesión
        Q.fcall(
            function () {
                return req.user.username;
            })
            .then(sessionUtils.deleteSessions)
            .done(function () {
                res.json({message: 'Páselo usted bien por ahí!'});
            }, function (error) {
                console.error('Error haciendo logout: ' + error);
                //return done(null, false, {message: 'Error al salir de la aplicación'});
                res.redirect('/fail');
            });
    });

    //**************** LOGIN FAIL ROUTER **********************
    //GET sobre el raíz del fail router (es decir sobre /fail)
    failRouter.get('/', function (req, res, next) {
        console.log("FAIL");
        res.json({"login": false});
    });

    // Asigno los router a sus rutas
    app.use('/login', loginRouter);
    app.use('/logout', logoutRouter);
    app.use('/fail', failRouter);
};