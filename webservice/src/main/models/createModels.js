'use strict';

//Este m�dulo crea los modelos de base de datos
module.exports = function (mongoose) {
    //Creo los modelos
    require('./user')(mongoose);
    require('./session')(mongoose);
};