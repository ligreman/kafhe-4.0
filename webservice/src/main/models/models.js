'use strict';

//Este módulo es simplemente para poder cargar todos los modelos haciendo un require a este módulo y no ir uno a uno
module.exports = function (mongoose) {

    //Expongo los modelos
    return {
        Game: mongoose.model('Game'),
        User: mongoose.model('User'),
        Admin: mongoose.model('Admin'),
        Session: mongoose.model('Session'),
        Meal: mongoose.model('Meal'),
        Drink: mongoose.model('Drink'),
        Skill: mongoose.model('Skill'),
        Shop: mongoose.model('Shop')
    };
};
