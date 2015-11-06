'use strict';

var CONSTANTS = require('../modules/config');

/**
 * Devuelve un elemento aleatorio de entre los posibles
 */
var getRandomElement = function () {
    return CONSTANTS.ELEMENTS[Math.floor(Math.random() * CONSTANTS.ELEMENTS.length)];
};

//Exporto las funciones de la librería utils para que puedan accederse desde fuera
module.exports = {
    getRandomElement: getRandomElement
};
