'use strict';

module.exports = function (app) {
    var console = process.console;

    var express = require('express'),
        passport = require('passport'),
        orderRouter = express.Router(),
        bodyParser = require('body-parser'),
        Q = require('q'),
        mongoose = require('mongoose'),
        models = require('../models/models')(mongoose);

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
                    console.tag('MONGO').error(error);
                    res.redirect('/error/errOrderList');
                    return;
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
     * POST /order/delete
     * Elimina el pedido del usuario.
     */
    orderRouter.post('/delete', function (req, res, next) {
        var user = req.user;

        // Compruebo el estado de la partida, si es 1 ó 2. Si no, error
        if (user.game.gamedata.status !== 1 && user.game.gamedata.status !== 2) {
            console.tag('ORDER-DELETE').error('No se permite esta acción en el estado actual de la partida');
            res.redirect('/error/errGameStatusNotAllowed');
            return;
        }

        user.game.order.meal = null;
        user.game.order.drink = null;
        user.game.order.ito = null;

        user.save(function (err) {
            if (err) {
                console.tag('MONGO').error(err);
                res.redirect('/error/errMongoSave');
                return;
            } else {
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
    });

    /**
     * POST /order
     * Crea un pedido nuevo para el usuario. Necesita 3 parámetros por POST-JSON:
     * meal: id del meal; drink:idDrink; ito: boolean
     */
    orderRouter.post('/', function (req, res, next) {
        var user = req.user,
            order = req.body;

        // Compruebo el estado de la partida, si es 1 ó 2. Si no, error
        if (user.game.gamedata.status !== 1 && user.game.gamedata.status !== 2) {
            console.tag('ORDER-DELETE').error('No se permite esta acción en el estado actual de la partida');
            res.redirect('/error/errGameStatusNotAllowed');
            return;
        }

        // Compruebo que los parámetros son correctos (no falta ninguno y que existen sus ids)
        if (!order.meal || !order.drink || order.ito === undefined) {
            console.tag('ORDER-NEW').error('Faltan parámetros en la petición');
            res.redirect('/error/errOrderNewParams');
            return;
        }

        // Consulto a Mongo a ver si existen
        Q.all([
            models.Meal.findById(order.meal).exec(),
            models.Drink.findById(order.drink).exec()
        ]).spread(function (newMeal, newDrink) {
            if (newMeal && newDrink) {
                // Compruebo que si quiero hacer un pedido ito, ambos componentes son ITAbles
                if (order.ito) {
                    // Si uno de los dos no es itable, error
                    if (!newMeal.ito || !newDrink.ito) {
                        console.tag('ORDER-NEW').error('O la comida o la bebida no forma parte de un desayuno ITO');
                        res.redirect('/error/errOrderNotBothIto');
                        return;
                    }
                }

                // Actualizo el pedido del usuario con los nuevos objetos
                user.game.order.meal = newMeal;
                user.game.order.drink = newDrink;
                user.game.order.ito = order.ito;

                user.save(function (err, newOrder, numAffected) {
                    if (err) {
                        console.tag('MONGO').error(err);
                        res.redirect('/error/errMongoSave');
                        return;
                    } else {
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
                console.tag('ORDER-NEW').error('No ha llegado el newMeal o newDrink');
                res.redirect('/error/errOrderNewUnknown');
                return;
            }

        }, function (error) {
            console.tag('MONGO').error(error);
            res.redirect('/error/errOrderNewNotFound');
            return;
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
                console.tag('MONGO').error(err);
                res.redirect('/error/errOrderAllNotFound');
                return;
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
