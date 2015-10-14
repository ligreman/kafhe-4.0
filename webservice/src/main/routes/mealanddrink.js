'use strict';

module.exports = function (app) {
    var console = process.console;

    var express = require('express'),
        mealRouter = express.Router(),
        Q = require('q'),
        mongoose = require('mongoose'),
        models = require('../models/models')(mongoose);

    //**************** MEAL ROUTER **********************
    /**
     * GET /mealanddrink
     * Devuelvo la lista de comidas y bebidas de mongo
     */
    mealRouter.get('/', function (req, res, next) {
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
    app.use('/mealanddrink', mealRouter);
};
