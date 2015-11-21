'use strict';

var RUNES = {
    // COMUNES
    common: [
        {
            material: 'madera',
            frecuency: 'common',
            stats_percentages: {
                damage: 50,
                precision: 0,
                protection: 50,
                parry: 0
            }
        },
        {
            material: 'hierro',
            frecuency: 'common',
            stats_percentages: {
                damage: 50,
                precision: 0,
                protection: 0,
                parry: 50
            }
        },
        {
            material: 'piedra',
            frecuency: 'common',
            stats_percentages: {
                damage: 0,
                precision: 50,
                protection: 50,
                parry: 0
            }
        },
        {
            material: 'plomo',
            frecuency: 'common',
            stats_percentages: {
                damage: 0,
                precision: 50,
                protection: 0,
                parry: 50
            }
        },
        {
            material: 'bronce',
            frecuency: 'common',
            stats_percentages: {
                damage: 50,
                precision: 0,
                protection: 25,
                parry: 25
            }
        },
        {
            material: 'laton',
            frecuency: 'common',
            stats_percentages: {
                damage: 0,
                precision: 50,
                protection: 25,
                parry: 25
            }
        },
        {
            material: 'cobre',
            frecuency: 'common',
            stats_percentages: {
                damage: 25,
                precision: 25,
                protection: 50,
                parry: 0
            }
        },
        {
            material: 'zinc',
            frecuency: 'common',
            stats_percentages: {
                damage: 25,
                precision: 25,
                protection: 0,
                parry: 50
            }
        }
    ],

    // INFRECUENTES
    uncommon: [
        {
            material: 'niquel',
            frecuency: 'uncommon',
            stats_percentages: {
                damage: 75,
                precision: 25,
                protection: 75,
                parry: 25
            }
        },
        {
            material: 'plata',
            frecuency: 'uncommon',
            stats_percentages: {
                damage: 75,
                precision: 25,
                protection: 25,
                parry: 75
            }
        },
        {
            material: 'acero',
            frecuency: 'uncommon',
            stats_percentages: {
                damage: 25,
                precision: 75,
                protection: 75,
                parry: 25
            }
        },
        {
            material: 'cobalto',
            frecuency: 'uncommon',
            stats_percentages: {
                damage: 25,
                precision: 75,
                protection: 25,
                parry: 75
            }
        },
        {
            material: 'tungsteno',
            frecuency: 'uncommon',
            stats_percentages: {
                damage: 50,
                precision: 50,
                protection: 50,
                parry: 50
            }
        }
    ],

    // RAROS
    rare: [
        {
            material: 'iridio',
            frecuency: 'rare',
            stats_percentages: {
                damage: 100,
                precision: 50,
                protection: 100,
                parry: 50
            }
        },
        {
            material: 'paladio',
            frecuency: 'rare',
            stats_percentages: {
                damage: 50,
                precision: 100,
                protection: 50,
                parry: 100
            }
        },
        {
            material: 'mithril',
            frecuency: 'rare',
            stats_percentages: {
                damage: 75,
                precision: 75,
                protection: 0,
                parry: 150
            }
        },
        {
            material: 'titanio',
            frecuency: 'rare',
            stats_percentages: {
                damage: 75,
                precision: 75,
                protection: 150,
                parry: 0
            }
        }
    ],
    // EXTRAORDINARIOS
    extraordinary: [
        {
            material: 'oro',
            frecuency: 'extraordinary',
            stats_percentages: {
                damage: 75,
                precision: 125,
                protection: 125,
                parry: 75
            }
        },
        {
            material: 'platino',
            frecuency: 'extraordinary',
            stats_percentages: {
                damage: 125,
                precision: 75,
                protection: 75,
                parry: 125
            }
        }
    ],

    legendary: [
        // LEGENDARIOS
        {
            material: 'adamantio',
            frecuency: 'legendary',
            stats_percentages: {
                damage: 150,
                precision: 150,
                protection: 150,
                parry: 150
            }
        }
    ]
};

// Valores base de las runas
var BASE_STATS = {
    damage: 50,
    precision: 100,
    protection: 20,
    parry: 30
};

// Porcentaje de éxito de subir nivel una runa al transmutar runas
var UPGRADES = {
    common: 50,
    uncommon: 35,
    rare: 25,
    extraordinary: 10
};

module.exports = {
    RUNES: RUNES,
    RUNE_BASE_STATS: BASE_STATS,
    RUNE_UPGRADE: UPGRADES
};
