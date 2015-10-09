'use strict';

module.exports = function (app) {
    var console = process.console;

    var passport       = require('passport'),
        LocalStrategy  = require('passport-local').Strategy,
        BearerStrategy = require('passport-http-bearer').Strategy,
        crypto         = require('crypto'),
        mongoose       = require('mongoose'),
        sessionUtils   = require('../modules/sessionUtils'),
        Q              = require('q'),
        modelos        = require('../models/models')(mongoose);

    // Estrategia Local de Passport - Se usa para hacer login
    passport.use(new LocalStrategy(
        function (username, password, done) {
            console.log("strategy");
            modelos.User.findOne({"username": username}, 'username password', function (err, user) {
                console.log("MONGOSEADO");
                console.log('Error: ' + err);
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

                //Cifro la contrase�a con SHA1
                //TODO tendr� que venir del frontend ya cifrada para que no viaje en claro
                var shasum = crypto.createHash('sha1');
                shasum.update(password);

                //Comparo con la de Mongo
                if (shasum.digest('hex') === user.password) {
                    //Login correcto
                    console.log('Login OK');

                    /**
                     * Lo primero de todo es una funci�n que devuelva el par�metro de la primera async que quiero ejecutar.
                     * Los then no llevan par�metros en la llamada a la funci�n, aunque siempre se pasa 1 que es el return
                     * de la anterior.
                     * En el done se ejecuta tanto si todo es correcto como si hay error, en dos funciones diferentes.
                     */
                    Q.fcall(function () {
                        return username;
                    })
                        .then(sessionUtils.deleteSessions)
                        .then(sessionUtils.createSession)
                        .done(function (access_token) {
                            console.log('Devuelvo el token de acceso: ' + access_token);

                            //Hago un return que resuelve el return general al ser el �ltimo
                            return done(null, user, {"access_token": access_token});
                        }, function (error) {
                            // We get here if any fails
                            console.error('Error creando la sesion del usuario: ' + error);
                            return done(null, false, {message: 'No se ha podido iniciar la sesi�n'});
                        });
                } else {
                    console.log('PASSWORD malo');
                    return done(null, false, {message: 'Contrase�a incorrecta'});
                }
            });
        }
    ));

    // Estrategia Bearer de Passport - Utilizada para cualquier petici�n al API que tenga que ir autenticada
    passport.use(new BearerStrategy(
        function (access_token, done) {
            // Proceso el access_token para extraer el username y el token de autenticaci�n
            var sessionData = sessionUtils.extractSessionFromAccessToken(access_token);
            console.tag('datos sesion').log(sessionData);
            //Si pasa alg�n error
            if (!sessionData) {
                //Falla ya que no pude extraer la sesi�n. Env�o un false y mensaje de error
                return done(null, false, {message: 'El token de sesi�n no es v�lido'});
            }

            modelos.Session.findOne({
                "username": sessionData.username,
                "token": sessionData.token
            }, function (err, session) {
                if (err) {
                    console.log('ERROR: ' + err);
                    return done(err);
                }

                if (session) {
                    console.log('Login BIEN');
                    //TODO devolver� la informaci�n del usuario �y un nuevo token?
                    return done(null, session);
                }

                console.log('TOKEN malo');
                return done(null, false, {message: 'No existe el token'});

            });
        }
    ));

    //Middleware para que se inicialice el passport
    app.use(passport.initialize());
}
;
