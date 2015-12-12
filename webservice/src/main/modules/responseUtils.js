'use strict';

/**
 * Se encarga de censurar aquéllos datos que no quiero devolver al frontend porque no los necesita. En concreto:
 * - Valor de reputación. No lo voy a usar en el front.
 * - Valores de las runas del inventario (damage, precision, protection, parry
 * - Valores base de armas y armaduras
 * - Valores de las skills dentro de las armas y armaduras
 * @param user Objeto usuario a censurar
 * @returns {*}
 */
var censureUser = function (user) {
    // Censuro la reputación
    user.game.stats.reputation = null;

    // Cambio de valores de las runas en el inventario
    user.game.inventory.runes.forEach(function (runa) {
        runa.stats_percentages.damage = valueToStars(runa.stats_percentages.damage, 25, 150);
        runa.stats_percentages.precision = valueToStars(runa.stats_percentages.precision, 25, 150);
        runa.stats_percentages.protection = valueToStars(runa.stats_percentages.protection, 25, 150);
        runa.stats_percentages.parry = valueToStars(runa.stats_percentages.parry, 25, 150);
    });

    return user;
};

/**
 * Cambia un valor a estrellas de 1 a 10
 * @param value Valor a convertir
 * @param minValue Mínimo valor que puede alcanzar value
 * @param maxValue Máximo valor que puede alcanzar value
 */
function valueToStars(value, minValue, maxValue) {
    maxValue -= minValue;

    return Math.floor(value * 10 / maxValue);
}

//Exporto las funciones de la librería
module.exports = {
    censureUser: censureUser
};

