'use strict';

// Contraseña por defecto de los usuarios
var DEFAULT_PASSWORD = '1234';

// Mínima cantidad de puntos para activar el modo furia
var FURY_MODE_MIN_POINTS = 100;

// Vida máxima
var MAX_LIFE = 1000;

// Reputación que se pierde al morir
var REPUTATION_LOST_DEAD = 100;

//Exporto las funciones de la librería utils para que puedan accederse desde fuera
module.exports = {
    DEFAULT_PASSWORD: DEFAULT_PASSWORD,
    FURY_MODE_MIN_POINTS: FURY_MODE_MIN_POINTS,
    MAX_LIFE: MAX_LIFE,
    REPUTATION_LOST_DEAD: REPUTATION_LOST_DEAD
};

