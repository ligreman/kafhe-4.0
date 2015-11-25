'use strict';

var TAFFY = require('taffy');


/**
 * Busca un arma en el inventario dada su ID
 * @param user Objeto usuario
 * @param idWeapon ID del arma
 * @returns {*} si no encuentra nada o no tiene nada equipado devuelve false, el objeto weapon si lo encuentra
 */
var getWeapon = function (user, idWeapon) {
    var weapons = TAFFY(user.game.inventory.weapons);
    var weapon = weapons({id: idWeapon}).get();

    if (weapon.length === 1) {
        return weapon[0];
    } else {
        return false;
    }
};

/**
 * Arma equipada
 * @param user El objeto usuario
 * @returns {*} si no encuentra nada o no tiene nada equipado devuelve false, el objeto weapon si lo encuentra
 */
var getEquippedWeapon = function (user) {
    if (!user.game.equipment.weapon) {
        return false;
    }

    return getWeapon(user, user.game.equipment.weapon);
};

/**
 * Busca una armadura en el inventario dada su ID
 * @param user Objeto usuario
 * @param idArmor ID del armadura
 * @returns {*} si no encuentra nada o no tiene nada equipado devuelve false, el objeto armor si lo encuentra
 */
var getArmor = function (user, idArmor) {
    var armors = TAFFY(user.game.inventory.armors);
    var armor = armors({id: idArmor}).get();

    if (armor.length === 1) {
        return armor[0];
    } else {
        return false;
    }
};


/**
 * Armadura equipada
 * @param user El objeto usuario
 * @returns {*} si no encuentra nada o no tiene nada equipado, el objeto armor si lo encuentra
 */
var getEquippedArmor = function (user) {
    if (!user.game.equipment.armor) {
        return false;
    }

    return getArmor(user, user.game.equipment.armor);
};

/**
 * Busca si el usuario tiene una habilidad concreta
 * @param user Objeto usuario
 * @param idSkill ID de la habilidad a buscar
 * @returns {*} False si no la encuentra, o el objeto Skill en caso de encontrarla
 */
var hasSkill = function (user, idSkill) {
    // Saco el arma y armadura equipadas
    var weaponEquipped = utilsUser.getEquippedWeapon(user);
    var armorEquipped = utilsUser.getEquippedArmor(user);
    var skills = [];

    // Skills del arma
    if (weaponEquipped) {
        skills = skills.concat(weaponEquipped.skills);
    }

    // Skills de la armadura
    if (armorEquipped) {
        skills = skills.concat(armorEquipped.skills);
    }

    if (skills.length === 0) {
        return false;
    }

    // Busco la skill en esta lista
    skills = TAFFY(skills);
    var skill = skills({id: idSkill}).get();

    if (skill.length === 1) {
        return skill[0];
    } else {
        return false;
    }
};

//Exporto las funciones de la librería
module.exports = {
    getWeapon: getWeapon,
    getArmor: getArmor,
    getEquippedWeapon: getEquippedWeapon,
    getEquippedArmor: getEquippedArmor,
    hasSkill: hasSkill
};

