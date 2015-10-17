'use strict';

module.exports = function (app) {
    var console = process.console;

    var express     = require('express'),
        passport    = require('passport'),
        orderRouter = express.Router(),
        mongoose    = require('mongoose'),
        models      = require('../models/models')(mongoose);

    //**************** ORDER ROUTER **********************
    //Middleware para estas rutas
    orderRouter.use(passport.authenticate('bearer', {
        session: false,
        failureRedirect: '/error/session'
    }));

    /**
     * GET /user/list
     * Obtiene la información de los usuarios de esta partida
     */
    orderRouter.get('/list', function (req, res, next) {
        // Saco la lista de jugadores de la partida
        var players = req.user.game.gamedata.players;

        // Hago una búsqueda de esa lista de usuarios
        models.User
            .find({"_id": {"$in": players}})
            .select('game.order alias')
            .populate('game.order.meal game.order.drink')
            .exec(function (error, playerList) {
                if (error) {
                    res.redirect('/error');
                }

                var pedidos = [];

                // Recorro la lista de usuarios y extraigo sus pedidos
                playerList.forEach(function (player) {
                    pedidos.push({
                        player_alias: player.alias,
                        meal: player.game.order.meal,
                        drink: player.game.order.drink,
                        ito: player.game.order.ito
                    });
                });

                res.json({
                    "data": {
                        "orders": pedidos
                    },
                    "error": ""
                });
            });
    });

    /**
     * POST /user
     * Crea un pedido nuevo para el usuario
     */
    orderRouter.post('/', function (req, res, next) {
        // Compruebo que los parámetros son correctos (no falta ninguno y que existen sus ids)

        // Actualizo el pedido del usuario con esos valores
        var user = req.user;
        //user.game.order.meal =
        //user.game.order.drink =
        //user.game.order.ito =

        user.save(function (err, product, numAffected) {
            /* console.log(product);
             console.log("Afecto: " + numAffected);
             if (err) {
             res.redirect('/error');
             } else {
             res.json({
             "data": {
             "user": usuario
             },
             "error": ""
             });
             }*/
        });
    });

    // Asigno los router a sus rutas
    app.use('/order', orderRouter);
};
