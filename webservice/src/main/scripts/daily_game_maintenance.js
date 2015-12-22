'use strict';

var b = new Date();
var amas = b.getTimezoneOffset();
// Sumo la hora para obtener GMT+1
amas += 60;

var fecha = new Date(b.getTime() + (amas * 60 * 1000)),
    hora  = fecha.getHours(), //0-23
    dia   = fecha.getDay(); //0-6 siendo 0 domingo

var mongoose = require('mongoose');
var mongoHost = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME || 'mongodb://localhost/kafhe';
mongoose.connect(mongoHost, {});

var Game   = require('../models/game')(mongoose),
    config = require('../modules/config'),
    events = require('events'),
    Q      = require('q');

//Gestor de eventos
var eventEmitter = new events.EventEmitter();

// Esto se ejecutará a la 1 de la mañana
hora = 1;
if (hora !== 1) {
    process.exit();
}
dia = 5;
switch (dia) {
    case 1: // Los lunes pongo las partidas en estado batalla, las que están en estado WEEKEND
        Game.update({"status": config.GAME_STATUS.WEEKEND}, {"status": config.GAME_STATUS.BATTLE}, {multi: true},
            function (error, num) {
                if (error) {
                    console.error(error);
                    process.exit();
                }

                console.log('Partidas en estado BATALLA después del fin de semana.');
                process.exit();
            }
        );
        break;
    case 5: //viernes pongo las partidas en negociacion
        Game.update({"status": config.GAME_STATUS.BATTLE}, {"status": config.GAME_STATUS.BUSINESS}, {multi: true},
            function (error, num) {
                if (error) {
                    console.error(error);
                    process.exit();
                }

                console.log('Partidas en estado NEGOCIACION después del fin de semana.');
                process.exit();
            }
        );
        break;
    case 6: //sabado
        gameFridayCloseAndCreate();
        break;
    default:
        process.exit();
}

/**
 * Las partidas en estado 3 las cierro y creo una nueva si era recursiva, en estado 0
 */
function gameFridayCloseAndCreate() {
    Game.find({"status": config.GAME_STATUS.RESOLUTION})
        .exec(function (error, games) {
            if (error) {
                console.error(error);
                process.exit();
            }

            var promises = [];

            games.forEach(function (game) {
                // Lo cierro y creo uno nuevo si es que era recursivo
                game.status = config.GAME_STATUS.CLOSED;
                promises.push(game.save());

                // Si era repetitivo creo uno nuevo
                if (game.repeat) {
                    var nuevo = new Game({
                        repeat: true,
                        status: config.GAME_STATUS.WEEKEND,
                        caller: null,
                        players: game.players,
                        notifications: []
                    });

                    promises.push(nuevo.save());
                }
            });

            Q.allSettled(promises)
                .then(function (results) {
                    var resultado = true, razon;
                    results.forEach(function (result) {
                        if (result.state !== "fulfilled") {
                            resultado = result.value;
                            razon = result.reason;
                        }
                    });

                    if (resultado !== true) {
                        console.error(razon);
                        process.exit();
                    }

                    eventEmitter.emit('gameFridayContinue');
                });
        });
}

/**
 * Las partidas en estado 2 se ponen a 0. De momento no reseteo reputaciones y demás
 */
eventEmitter.on('gameFridayContinue', function () {
    Game.update({"status": config.GAME_STATUS.BUSINESS}, {"status": config.GAME_STATUS.WEEKEND}, {multi: true},
        function (error, num) {
            if (error) {
                console.error(error);
                process.exit();
            }

            console.log('Partidas en estado NEGOCIACIONES no se cerraron y pasan a WEEKEND para continuar la semana que viene.');
            process.exit();
        }
    );

    /*Game.find({"status": config.GAME_STATUS.BUSINESS})
     .exec(function (error, games) {
     if (error) {
     console.error(error);
     process.exit();
     }

     var promises = [];

     games.forEach(function (game) {
     // Lo cierro y creo uno nuevo si es que era recursivo
     game.status = config.GAME_STATUS.WEEKEND;
     promises.push(game.save());
     });
     });*/
});
