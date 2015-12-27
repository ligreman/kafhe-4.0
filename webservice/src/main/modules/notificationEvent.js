'use strict';

var util         = require('util'),
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
NotificationEvent.prototype.notifyUser = function (idUser, notification) {
    console.log("papocho");
};


// Exporto el módulo
module.exports = NotificationEvent;
