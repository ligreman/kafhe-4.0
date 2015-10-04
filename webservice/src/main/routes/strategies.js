'use strict';

module.exports = function (app) {
    var passport       = require('passport'),
        LocalStrategy  = require('passport-local').Strategy,
        BearerStrategy = require('passport-http-bearer').Strategy,
        crypto         = require('crypto'),
        mongoose       = require('mongoose'),
        modelos        = require('../models/user')(mongoose);

    // Estrategia Local de Passport - Se usa para hacer login
    passport.use(new LocalStrategy(
        function (username, password, done) {
            console.log("strategy");
            modelos.User.findOne({username: username}, function (err, user) {
                console.log("MONGOSEADO");
                console.log(err);
                console.log(user);

                if (err) {
                    console.log("ERROR: " + err);
                    return done(err);
                }

                if (!user) {
                    console.log("USERNAME malo");
                    return done(null, false, {message: 'Nombre de usuario incorrecto'});
                }
                console.log("Miro si pass es correcto");

                //Cifro la contraseña con SHA1
                //TODO tendrá que venir del frontend ya cifrada para que no viaje en claro
                var shasum = crypto.createHash('sha1');
                shasum.update(password);

                //Comparo con la de Mongo
                if (shasum.digest('hex') !== user.password) {
                    console.log("PASSWORD malo");
                    return done(null, false, {message: 'Contraseña incorrecta'});
                }

                console.log("TODO BIEN");
                return done(null, user, {hola: 'manolo'});
            });
        }
    ));

    // Estrategia Bearer de Passport - Utilizada para cualquier petición al API que tenga que ir autenticada
    passport.use(new BearerStrategy(
        function (access_token, done) {
            modelos.User.findOne({"session.access_token": access_token}, function (err, user) {
                if (err) {
                    console.log("ERROR: " + err);
                    return done(err);
                }

                if (!user) {
                    console.log("TOKEN malo");
                    return done(null, false, {message: 'No existe el token'});
                }

                console.log("TODO BIEN");
                return done(null, user);
            });
        }
    ));

    //Middleware para que se inicialice el passport
    app.use(passport.initialize());
};
