'use strict';

module.exports = function (app) {
    var console = process.console;

    var express    = require('express'),
        mealRouter = express.Router(),
        Q          = require('q'),
        mongoose   = require('mongoose'),
        modelos    = require('../models/models')(mongoose);

    //**************** MEAL ROUTER **********************
    /**
     * /mealanddrink
     * Devuelvo la lista de comidas y bebidas de mongo
     */
    mealRouter.get('/', function (req, res, next) {
        //Proceso y devuelvo los resultados
        var answer = function (meals, drinks) {
            if (!meals || !drinks) {
                res.redirect('/error');
            }

            res.json({
                "data": {
                    "meals": meals,
                    "drinks": drinks
                },
                "error": ""
            });
        };

        // Lanzo las dos consultas a Mongo
        Q.all([
            modelos.Meal.find({}).exec(),
            modelos.Drink.find({}).exec()
        ]).spread(answer);
    });


    // Asigno los router a sus rutas
    app.use('/mealanddrink', mealRouter);
};