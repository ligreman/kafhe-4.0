'use strict';

module.exports = function (app) {
    var console = process.console;

    // Error al hacer login. Envío login:false para que el front borre la cookie
    app.all('/error/login', function (req, res) {
        res.status(401).json({
            "login": false,
            "error": "Usuario o contraseña incorrectos"
        });
    });

    // Error en la sesión. Envío login:false para que el front borre la cookie
    app.all('/error/session', function (req, res) {
        res.status(401).json({
            "login": false,
            "error": "Error en la sesión"
        });
    });

    // Ruta de error general
    app.all('/error', function (req, res) {
        res.status(500).json({
            "error": "Error en el servicio"
        });
    });
};