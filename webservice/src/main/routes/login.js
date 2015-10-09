'use strict';

module.exports = function (app) {
    var console = process.console;

    var express          = require('express'),
        passport         = require('passport'),
        bodyParser       = require('body-parser'),
        urlencodedParser = bodyParser.urlencoded({extended: false}),
        loginRouter      = express.Router(),
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

    //**************** LOGIN FAIL ROUTER **********************
    //GET sobre el raíz del fail router (es decir sobre /fail)
    failRouter.get('/', function (req, res, next) {
        console.log("FAIL");
        res.json({"login": false});
    });

    // Asigno los router a sus rutas
    app.use('/login', loginRouter);
    app.use('/fail', failRouter);
};