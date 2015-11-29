'use strict';

// Contraseña por defecto de los usuarios
var DEFAULT_PASSWORD = '1234';

// Mínima cantidad de puntos para activar el modo furia. Cada estos puntos es una barra de furia
var FURY_MODE_ACTIVATE_MIN_POINTS = 1000;
// Cuanto consume un ataque de furia
var FURY_MODE_USE_POINTS = 500;
// Multiplicador del modo furia
var FURY_MODE_MULTIPLIER = 2;

// Daño que recibes si no tienes armadura, en %
var DAMAGE_NO_ARMOR = 120;

// Vida máxima
var MAX_LIFE = 1000;

// Reputación que se pierde al morir
var REPUTATION_LOST_DEAD = 100;

var CAUSE = {
    damage: 'damage',
    protection: 'protection'
};

//Exporto las funciones de la librería utils para que puedan accederse desde fuera
module.exports = {
    DEFAULT_PASSWORD: DEFAULT_PASSWORD,
    FURY_MODE_ACTIVATE_MIN_POINTS: FURY_MODE_ACTIVATE_MIN_POINTS,
    FURY_MODE_USE_POINTS: FURY_MODE_USE_POINTS,
    FURY_MODE_MULTIPLIER: FURY_MODE_MULTIPLIER,
    MAX_LIFE: MAX_LIFE,
    REPUTATION_LOST_DEAD: REPUTATION_LOST_DEAD,
    CAUSE: CAUSE,
    DAMAGE_NO_ARMOR: DAMAGE_NO_ARMOR
};

