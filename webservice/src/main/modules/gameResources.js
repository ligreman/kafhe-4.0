'use strict';

var ELEMENTS_DATA    = require('../modules/gamedata/elements'),
    FRECUENCIES_DATA = require('../modules/gamedata/frecuencies'),
    RUNES_DATA       = require('../modules/gamedata/runes'),
    utils            = require('../modules/utils');


/**
 * Devuelve un elemento aleatorio de entre los posibles
 */
var getRandomElement = function () {
    return ELEMENTS_DATA.ELEMENTS[Math.floor(Math.random() * ELEMENTS_DATA.ELEMENTS.length)];
};

/**
 * Devuelve un tostem aleatorio de nivel indicado. Se puede indicar el elemento o dejar que sea aleatorio.
 * @param level el nivel del tostem a generar
 * @param element Elemento del tostem. Si es null o no se indica, se genera aleatoriamente
 */
var getRandomTostem = function (level, element) {
    if (!element) {
        element = getRandomElement();
    }

    var newTostem = {
        id: utils.generateId(),
        type: element,
        level: nivel,
        equipped: false
    };

    return newTostem;
};

/**
 * Devuelve una runa aleatoria de una frecuencia determinada
 * @param frecuency = common, uncommon, rare, extraordinary, legendary
 */
var getRandomRune = function (frecuency) {
    var runes = RUNES_DATA.RUNES[frecuency];
    var newRune = runes[Math.floor(Math.random() * runes.length)];

    // Genero un id para la runa y le pongo que no está equipada
    newRune.id = utils.generateId();
    newRune.equipped = false;

    return newRune;
};

/**
 * Devuelve la frecuencia superior a la que se le pasa
 * @param current Frecuencia actual que quiero mejorar, en formato texto
 */
var upgradeFrecuency = function (current) {
    var numFrec = FRECUENCIES_DATA.FRECUENCIES[current];

    // Si no hay más, devuelvo esta misma
    if (numFrec === FRECUENCIES_DATA.FRECUENCIES.length) {
        return current;
    } else {
        numFrec++;

        return FRECUENCIES_DATA.INVERSE_FRECUENCIES[numFrec];
    }
};

//Exporto las funciones de la librería utils para que puedan accederse desde fuera
module.exports = {
    getRandomElement: getRandomElement,
    getRandomRune: getRandomRune,
    getRandomTostem: getRandomTostem,
    upgradeFrecuency: upgradeFrecuency,

    ELEMENTS: ELEMENTS_DATA.ELEMENTS,
    FRECUENCIES: FRECUENCIES_DATA.FRECUENCIES,
    INVERSE_FRECUENCIES: FRECUENCIES_DATA.INVERSE_FRECUENCIES,
    RUNES: RUNES_DATA.RUNES,
    RUNE_UPGRADE: RUNES_DATA.RUNE_UPGRADE
};
