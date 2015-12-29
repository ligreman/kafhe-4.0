'use strict';

var console      = process.console,
    mongoose     = require('mongoose'),
    modelos      = require('../models/models')(mongoose),
    util         = require('util'),
    EventEmitter = require('events').EventEmitter;

function NotificationEvent() {
    // Initialize necessary properties from `EventEmitter` in this instance
    EventEmitter.call(this);

    // Escucho un evento, aunque tambien podría emitir...
    this.on('paco', function () {
        console.log("pacoooo");
    });
}

// Inherit functions from `EventEmitter`'s prototype
util.inherits(NotificationEvent, EventEmitter);

// Funciones extra

/**
 * Notificación personal de un usuario
 */
NotificationEvent.prototype.notifyUser = function (idUser, json, type) {
    var notification = {
        message: json,
        type: type,
        timestamp: new Date().getTime()
    };

    // Guardo la notificación en el usuario
    modelos.User
        .findByIdAndUpdate(
            idUser,
            {$push: {"game.notifications": notification}}
        )
        .exec(function (error, user) {
            if (error) {
                console.tag('MONGO').error(error);
                utils.error(res, 400, 'errNotificationUser');
                return;
            }
            console.log(user);
        });
};

/**
 * Notificación de sistema
 */
NotificationEvent.prototype.notifyGame = function (idGame, json, type) {
    var notification = {
        message: json,
        type: type,
        timestamp: new Date().getTime()
    };

    // Guardo la notificación en la partida
    modelos.Game
        .findByIdAndUpdate(
            idGame,
            {$push: {notifications: notification}}
        )
        .exec(function (error, user) {
            if (error) {
                console.tag('MONGO').error(error);
                utils.error(res, 400, 'errNotificationGame');
                return;
            }
        });
};

// Exporto el módulo
module.exports = NotificationEvent;
