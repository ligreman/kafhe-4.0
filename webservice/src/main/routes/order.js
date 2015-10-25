'use strict';

module.exports = function (app) {
    var console = process.console;

    var express     = require('express'),
        passport    = require('passport'),
        orderRouter = express.Router(),
        bodyParser  = require('body-parser'),
        Q           = require('q'),
        mongoose    = require('mongoose'),
        models      = require('../models/models')(mongoose);

    //**************** ORDER ROUTER **********************
    //Middleware para estas rutas
    orderRouter.use(bodyParser.json());
    orderRouter.use(passport.authenticate('bearer', {
        session: false,
        failureRedirect: '/error/session'
    }));

    /**
     * GET /order/list
     * Obtiene la información de los pedidos de usuarios de esta partida
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
     * POST /
     * Crea un pedido nuevo para el usuario. Necesita 3 parámetros por POST-JSON:
     * meal: id del meal; drink:idDrink; ito: boolean
     */
    orderRouter.post('/', function (req, res, next) {
        var user  = req.user,
            order = req.body;

        // Compruebo que los parámetros son correctos (no falta ninguno y que existen sus ids)
        if (!order.meal || !order.drink || order.ito === undefined) {
            res.redirect('/error');
        }

        // Consulto a Mongo a ver si existen
        Q.all([
            models.Meal.findById(order.meal).exec(),
            models.Drink.findById(order.drink).exec()
        ]).spread(function (newMeal, newDrink) {

            if (newMeal && newDrink) {
                // Actualizo el pedido del usuario con los nuevos objetos
                user.game.order.meal = newMeal;
                user.game.order.drink = newDrink;
                user.game.order.ito = order.ito;

                models.User.update({"username": user.username},
                    {
                        $set: {
                            "game.order.meal": order.meal,
                            "game.order.drink": order.drink,
                            "game.order.ito": order.ito
                        }
                    },
                    function (err, raw) {
                        if (err) {
                            res.redirect('/error');
                        } else {
                            //console.log(req.authInfo);
                            //console.log(user);
                            res.json({
                                "data": {
                                    "user": user
                                },
                                "session": {
                                    "access_token": req.authInfo.access_token,
                                    "expire": 1000 * 60 * 60 * 24 * 30
                                },
                                "error": ""
                            });
                        }
                    });
            } else {
                res.redirect('/error');
            }

        }, function (error) {
            res.redirect('/error');
        });
    });

    /**
     * GET /order/mealanddrink
     * Devuelvo la lista de comidas y bebidas de mongo
     */
    orderRouter.get('/mealanddrink', function (req, res, next) {
        //Proceso y devuelvo los resultados
        var answer = function (meals, drinks) {
            if (!meals || !drinks) {
                res.redirect('/error');
            } else {
                res.json({
                    "data": {
                        "meals": meals,
                        "drinks": drinks
                    },
                    "session": {
                        "access_token": req.authInfo.access_token,
                        "expire": 1000 * 60 * 60 * 24 * 30
                    },
                    "error": ""
                });
            }
        };

        // Lanzo las dos consultas a Mongo
        Q.all([
            models.Meal.find({}).exec(),
            models.Drink.find({}).exec()
        ]).spread(answer);
    });

    // Asigno los router a sus rutas
    app.use('/order', orderRouter);
};
