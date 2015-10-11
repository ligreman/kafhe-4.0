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
        failureRedirect: '/loginfailed'
    }));

    //Si se hace login correctamente, pasará aquí
    loginRouter.post('/', function (req, res, next) {
        console.log("POST");
        console.log(req.user);
        console.log(req.authInfo);
        res.json({
            "login": true,
            //"user": req.user,
            "session": {
                "access_token": req.authInfo.access_token
            },
            "error": ""
        });
    });

    //**************** LOGOUT ROUTER **********************
    logoutRouter.use(passport.authenticate('bearer', {
        session: false,
        failureRedirect: '/error'
    }));
    logoutRouter.get('/', function (req, res, next) {
        // Una vez identificado con el token, hago logout borrando la sesión
        Q.fcall(
            function () {
                //Paso este parámetro a deleteSessions
                return req.user.username;
            })
            .then(sessionUtils.deleteSessions)
            .done(function () {
                res.json({
                    "logout": true,
                    "error": ""
                });
            }, function (error) {
                console.error('Error haciendo logout: ' + error);
                //return done(null, false, {message: 'Error al salir de la aplicación'});
                res.redirect('/error');
            });
    });

    //**************** LOGIN FAIL ROUTER **********************
    //GET sobre el raíz del fail router (es decir sobre /fail)
    failRouter.get('/', function (req, res, next) {
        console.log("FAIL");
        res.json({
            "login": false,
            "error": "Login error"
        });
    });

    // Asigno los router a sus rutas
    app.use('/login', loginRouter);
    app.use('/loginfailed', failRouter);
    app.use('/logout', logoutRouter);
};