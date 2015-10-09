'use strict';

//Este módulo es simplemente para poder cargar todos los modelos haciendo un require a este módulo y no ir uno a uno
module.exports = function (mongoose) {

    //Expongo los modelos
    /*return {
     User: require('./user')(mongoose),
     Session: require('./session')(mongoose)
     };*/

    return {
        User: mongoose.model('User'),
        Session: mongoose.model('Session')
    };
};