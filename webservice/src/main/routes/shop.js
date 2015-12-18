'use strict';

module.exports = function (app) {
    var console = process.console;

    var express    = require('express'),
        passport   = require('passport'),
        //utils      = require('../modules/utils'),
        shopRouter = express.Router(),
        bodyParser = require('body-parser'),
        //Q          = require('q'),
        mongoose   = require('mongoose'),
        models     = require('../models/models')(mongoose);

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
                        real_amount: item.amount - tengo,
                        item: item
                    });
                });

                res.json({
                    "data": {
                        "items": items
                    },
                    "error": ""
                });
            });
    });

    // Asigno los router a sus rutas
    app.use('/shop', shopRouter);
};
