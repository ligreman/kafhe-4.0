'use strict';

var console       = process.console,
    TAFFY         = require('taffy'),
    Q             = require('q'),
    utils         = require('./utils'),
    config        = require('./config'),
    gameResources = require('./gameResources');


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

/**
 * Actualiza una habilidad dentro de la estructura del User
 * @param user Objeto usuario
 * @param idSkill ID skill a actualizar
 * @param source Fuente de la skill: weapon o armor
 * @param changes Objeto con la actualización: {uses: 5}
 * @returns {*}
 */
var updateSkill = function (user, idSkill, source, changes) {
    var skills;
    skills = user.game.equipment[source].skills;

    // Actualizo el listado de skills
    skills = TAFFY(skills);
    skills({id: idSkill}).update(changes); // TODO probar ,false

    user.game.equipment[source].skills = skills;

    return user;
};

/**
 * Calcula el resultado de un ataque con habilidad
 * @param skillUsed Objeto habilidad usada por el atacante
 * @param target Objeto user del defensor
 * @returns {object} Objeto con { damage: Daño en número que recibe el defensor, protection: daño evitado por la protección}
 */
var combatResult = function (skillUsed, target) {
    var damage = 0, protection = 0;

    // Saco armadura del defensor
    var armorDef = getEquippedArmor(target);

    // Valor base de daño con precisión aplicada
    damage = Math.round(skillUsed.stats.damage * (skillUsed.stats.precision + 100) / 100);

    // Calculo si el defensor bloquea y en ese caso miro la protección
    if (utils.dice100(100 - armorDef.base_stats.parry)) {
        protection = armorDef.base_stats.protection;
    }

    // Daño base final, mínimo de 0
    damage = Math.max(damage - protection, 0);

    // Calculo variación de daño por enfrentamiento de elementos
    var elemPercent = gameResources.ELEMENT_DAMAGE[skillUsed.element][armorDef.element];
    damage = Math.round(damage * elemPercent / 100);

    // Calculo variación de daño por enfrentamiento de tipos
    var typePercent = gameResources.WEAPON_DAMAGE[skillUsed.class][armorDef.class];
    damage = Math.round(damage * typePercent / 100);

    return {
        damage: damage,
        protection: protection
    };
};

/**
 * Promise para salvar el usuario
 * @param user
 * @returns {*}
 */
var saveUser = function (user) {
    var defer = Q.defer();

    user.save(function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(user);
        }
    });

    return defer.promise;
};

/**
 * Hace daño al jugador
 * @param user Objeto usuario
 * @param damage Daño que recibe
 * @returns {{user: *, hasDied: boolean, reputationLost}}
 */
var takeDamage = function (user, damage) {
    var muere = false;
    user.game.stats.life -= damage;

    // ¿Muere?
    if (user.game.stats.life <= 0) {
        user.game.stats.life = config.MAX_LIFE + user.game.stats.life;

        // Le quito reputación
        user.game.stats.reputation -= config.REPUTATION_LOST_DEAD;

        muere = true;
    }

    return {
        user: user,
        hasDied: muere,
        reputationLost: config.REPUTATION_LOST_DEAD
    };
};

/**
 * Añade reputación al usuario dependiendo de qué lo haya causado
 * @param user Objeto usuario
 * @param sourceAmount Cantidad de causa que ha provocado el ganar reputación (daño, daño prevenido...)
 * @param causa 'damage', 'protection'
 * @returns {*}
 */
var addReputation = function (user, sourceAmount, causa) {
    var ganancia = 0;

    switch (causa) {
        case 'damage':
            //= ROUND(100 * J34 * $K$34 / 3500)


            break;
        case 'protection':
            break;
    }

    // Sumo o resto lo ganado
    user.game.stats.reputation += ganancia;

    return {
        user: user,
        reputation: ganancia
    };
};

//Exporto las funciones de la librería
module.exports = {
    getWeapon: getWeapon,
    getArmor: getArmor,
    getEquippedWeapon: getEquippedWeapon,
    getEquippedArmor: getEquippedArmor,
    hasSkill: hasSkill,
    updateSkill: updateSkill,
    combatResult: combatResult,
    saveUser: saveUser,
    takeDamage: takeDamage,
    addReputation: addReputation
};

