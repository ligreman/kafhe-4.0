'use strict';

var ELEMENTS_DATA    = require('../modules/gamedata/elements'),
    FRECUENCIES_DATA = require('../modules/gamedata/frecuencies'),
    RUNES_DATA       = require('../modules/gamedata/runes'),
    WEAPON_DATA      = require('../modules/gamedata/weapons'),
    TAFFY            = require('taffy'),
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
        element: element,
        level: level,
        in_use: false
    };

    return newTostem;
};

/**
 * Devuelve una runa aleatoria de una frecuencia determinada
 * @param frecuency = common, uncommon, rare, extraordinary, legendary
 */
var getRandomRune = function (frecuency) {
    console.log(frecuency);
    console.log(RUNES_DATA.RUNES[frecuency]);
    var runes = RUNES_DATA.RUNES[frecuency];
    var newRune = runes[Math.floor(Math.random() * runes.length)];

    // Genero un id para la runa y le pongo que no está equipada
    newRune.id = utils.generateId();
    newRune.in_use = false;

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

/**
 * Busca una runa dado su material (son únicos).
 * @param materialSearch Material de la runa a buscar
 * @return object El objeto con la runa, o null si no la encuentra.
 */
var findRuneByMaterial = function (materialSearch) {
    var rune     = [],
        allRunes = [];

    allRunes.push(TAFFY(RUNES_DATA.RUNES['common']));
    allRunes.push(TAFFY(RUNES_DATA.RUNES['uncommon']));
    allRunes.push(TAFFY(RUNES_DATA.RUNES['rare']));
    allRunes.push(TAFFY(RUNES_DATA.RUNES['extraordinary']));
    allRunes.push(TAFFY(RUNES_DATA.RUNES['legendary']));

    // Voy buscando la runa
    var count = 0;
    while (rune.length !== 1 && (count < allRunes.length)) {
        rune = allRunes[count]({material: materialSearch}).get();
        count++;
    }

    // Devuelvo el resultado
    if (rune.length !== 1) {
        return null;
    } else {
        return rune[0];
    }
};


/**
 * Genera un nombre aleatorio para un arma
 * @param clase
 * @param elemento
 * @param hasOwner
 * @returns {string}
 */
var getRandomWeaponName = function (clase, elemento, hasOwner) {
    var classNames   = WEAPON_DATA.CLASS_NAMES,
        featureNames = WEAPON_DATA.FEATURE_NAMES;


    // Cojo según la clase de arma un nombre de clase
    var className = classNames[clase][Math.floor(Math.random() * classNames[clase].length)];

    //Ahora la feature del arma según elemento y género
    var featureName = featureNames[elemento][Math.floor(Math.random() * featureNames[elemento].length)];

    // Si tiene propietario
    var ownerName = '';
    if (hasOwner) {
        var ownerNames = WEAPON_DATA.OWNER_NAMES;

        ownerName = ownerNames['common'][Math.floor(Math.random() * ownerNames['common'].length)];
        ownerName = ' ' + ownerName.text;
    }

    // Compongo el nombre
    return className.text + ' ' + featureName.text[className.gender] + ownerName;
};

//Exporto las funciones de la librería utils para que puedan accederse desde fuera
module.exports = {
    getRandomElement: getRandomElement,
    getRandomRune: getRandomRune,
    getRandomTostem: getRandomTostem,
    upgradeFrecuency: upgradeFrecuency,
    getRandomWeaponName: getRandomWeaponName,

    FRECUENCIES_TO_NUMBER: FRECUENCIES_DATA.FRECUENCIES,
    FRECUENCIES_TO_STRING: FRECUENCIES_DATA.INVERSE_FRECUENCIES,

    findRuneByMaterial: findRuneByMaterial,

    ELEMENTS: ELEMENTS_DATA.ELEMENTS,
    RUNES: RUNES_DATA.RUNES,
    RUNE_UPGRADE: RUNES_DATA.RUNE_UPGRADE,
    RUNE_BASE_STATS: RUNES_DATA.RUNE_BASE_STATS,

    WEAPON_CLASSES: WEAPON_DATA.CLASSES,
    WEAPON_BASE_STATS: WEAPON_DATA.BASE_STATS,
    WEAPON_CLASS_NAMES: WEAPON_DATA.CLASS_NAMES,
    WEAPON_FEATURE_NAMES: WEAPON_DATA.FEATURE_NAMES,
    WEAPON_OWNER_NAMES: WEAPON_DATA.OWNER_NAMES
};
