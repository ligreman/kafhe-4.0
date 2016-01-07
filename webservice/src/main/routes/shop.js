'use strict';

module.exports = function (app) {
    var console = process.console;

    var express       = require('express'),
        passport      = require('passport'),
        utils         = require('../modules/utils'),
        responseUtils = require('../modules/responseUtils'),
        shopRouter    = express.Router(),
        bodyParser    = require('body-parser'),
        //Q          = require('q'),
        mongoose      = require('mongoose'),
        models        = require('../models/models')(mongoose),
        config        = require('../modules/config');

    //**************** ORDER ROUTER **********************
    //Middleware para estas rutas
    shopRouter.use(bodyParser.json());
    shopRouter.use(passport.authenticate('bearer', {
        session: false
    }));

    /**
     * GET /shop/list
     * Obtiene la información de los artículos de la tienda.
     * Los marca como comprados ya si no puedo adquirir más.
     */
    shopRouter.get('/list', function (req, res, next) {
        // Saco la lista de items que ya tiene el jugador
        var userItemsAux = req.user.game.inventory.items,
            userItems    = [];

        // A ver cuántos objetos de cada tiene el usuario
        userItemsAux.forEach(function (unItem) {
            userItems[unItem._id] = unItem.amount;
        });

        // Hago una búsqueda de los items de la tienda que puede comprar según su nivel
        models.Shop
            // Los que requiere nivel menor o igual que el nivel del jugador
            .find({"min_level": {$lte: req.user.game.level}})
            .exec(function (error, itemList) {
                if (error) {
                    console.tag('MONGO').error(error);
                    utils.error(res, 400, 'errShopList');
                    return;
                }

                var items = [];

                // Recorro los items de la tienda y voy marcando si puedo o no comprarlos
                itemList.forEach(function (item) {
                    var stock = false, tengo = 0;

                    if (userItems[item._id]) {
                        tengo = userItems[item._id];
                    }

                    // A ver cuántos tiene ya el usuario
                    if (item.amount > tengo) {
                        // Todavía quedan
                        stock = true;
                    }

                    items.push({
                        stock: stock,
                        stock_amount: item.amount - tengo,
                        info: item
                    });
                });

                res.json({
                    "data": {
                        "items": items
                    },
                    "session": {
                        "access_token": req.authInfo.access_token,
                        "expire": 1000 * 60 * 60 * 24 * 30
                    },
                    "error": ""
                });
            });
    });

    /**
     * POST /shop/buy
     * Compra un objeto de la tienda
     */
    shopRouter.post('/buy', function (req, res, next) {
        var usuario              = req.user,
            params               = req.body,
            idItem               = params.item_id,
            userItemsAux         = usuario.game.inventory.items,
            esteItem, otrosItems = [];

        // A ver cuántos objetos de cada tiene el usuario
        userItemsAux.forEach(function (unItem) {
            if (unItem._id === idItem) {
                esteItem = unItem;
            } else {
                otrosItems.push(unItem);
            }
        });

        // Compruebo que la partida está en estado para comprar
        if (usuario.game.gamedata.status !== config.GAME_STATUS.BUSINESS) {
            console.tag('SHOP-BUY').error('No se permite esta acción en el estado actual de la partida');
            utils.error(res, 400, 'errGameStatusNotAllowed');
            return;
        }

        models.Shop
            // Los que requiere nivel menor o igual que el nivel del jugador
            .findById(idItem)
            .exec(function (error, shopItem) {
                if (error) {
                    console.tag('MONGO').error(error);
                    utils.error(res, 400, 'errShopFindItem');
                    return;
                }

                // Compruebo que el item_id existe
                if (!shopItem) {
                    console.tag('SHOP-BUY').error('No se encuentra el objeto en Mongo');
                    utils.error(res, 400, 'errShopBuyItemNotFound');
                    return;
                }

                // Compruebo que hay stock para comprarlo. He de restar la cantidad de Mongo con lo que tiene ya el user
                var stock = shopItem.amount;
                if (esteItem && esteItem.amount >= stock) {
                    console.tag('SHOP-BUY').error('No hay stock en la tienda');
                    utils.error(res, 400, 'errShopBuyItemNoStock');
                    return;
                }

                // Compruebo que puedo comprarlo por requisito de nivel
                if (shopItem.min_level > usuario.game.level) {
                    console.tag('SHOP-BUY').error('No tienes nivel suficiente para comprar este objeto');
                    utils.error(res, 400, 'errShopBuyItemNoMinLevel');
                    return;
                }

                // Compruebo que tengo tostolares para comprarlo
                if (shopItem.price > usuario.game.tostolares) {
                    console.tag('SHOP-BUY').error('No tienes tostólares suficientes');
                    utils.error(res, 400, 'errShopBuyNoTostolares');
                    return;
                }

                // Lo compro. Es decir, creo una entrada en el inventario del usuario con el objeto
                // Si ya tenía pues sumo uno
                if (esteItem) {
                    esteItem.amount++;
                }
                // Si no tenía tengo que crearlo
                else {
                    esteItem = {
                        _id: shopItem._id,
                        key: shopItem.key,
                        icon: shopItem.icon,
                        amount: 1,
                        action: shopItem.action
                    };
                }

                // Guardo el objeto en el inventario de objetos del usuario
                otrosItems.push(esteItem);
                usuario.game.inventory.items = otrosItems;

                // Resto tostólares
                usuario.game.tostolares -= shopItem.price;

                usuario.save(function (err) {
                    if (err) {
                        console.tag('MONGO').error(err);
                        utils.error(res, 400, 'errMongoSave');
                        return;
                    } else {
                        res.json({
                            "data": {
                                "user": responseUtils.censureUser(usuario)
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
    });

    // Asigno los router a sus rutas
    app.use('/shop', shopRouter);
};
