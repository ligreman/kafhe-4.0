'use strict';

var randomInt = function (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
};

//Exporto las funciones de la librería utils para que puedan accederse desde fuera
module.exports = {
    randomInt: randomInt
};
