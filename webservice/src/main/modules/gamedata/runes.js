'use strict';

const RUNES = {
    // COMUNES
    common: [
        {
            type: 'madera',
            frecuency: 'common',
            stats_percentages: {
                damage: 50,
                precision: 0,
                protection: 50,
                parry: 0
            }
        },
        {
            type: 'hierro',
            frecuency: 'common',
            stats_percentages: {
                damage: 50,
                precision: 0,
                protection: 0,
                parry: 50
            }
        },
        {
            type: 'piedra',
            frecuency: 'common',
            stats_percentages: {
                damage: 0,
                precision: 50,
                protection: 50,
                parry: 0
            }
        },
        {
            type: 'plomo',
            frecuency: 'common',
            stats_percentages: {
                damage: 0,
                precision: 50,
                protection: 0,
                parry: 50
            }
        },
        {
            type: 'bronce',
            frecuency: 'common',
            stats_percentages: {
                damage: 50,
                precision: 0,
                protection: 25,
                parry: 25
            }
        },
        {
            type: 'laton',
            frecuency: 'common',
            stats_percentages: {
                damage: 0,
                precision: 50,
                protection: 25,
                parry: 25
            }
        },
        {
            type: 'cobre',
            frecuency: 'common',
            stats_percentages: {
                damage: 25,
                precision: 25,
                protection: 50,
                parry: 0
            }
        },
        {
            type: 'zinc',
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
            type: 'niquel',
            frecuency: 'uncommon',
            stats_percentages: {
                damage: 75,
                precision: 25,
                protection: 75,
                parry: 25
            }
        },
        {
            type: 'plata',
            frecuency: 'uncommon',
            stats_percentages: {
                damage: 75,
                precision: 25,
                protection: 25,
                parry: 75
            }
        },
        {
            type: 'acero',
            frecuency: 'uncommon',
            stats_percentages: {
                damage: 25,
                precision: 75,
                protection: 75,
                parry: 25
            }
        },
        {
            type: 'cobalto',
            frecuency: 'uncommon',
            stats_percentages: {
                damage: 25,
                precision: 75,
                protection: 25,
                parry: 75
            }
        },
        {
            type: 'tungsteno',
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
            type: 'iridio',
            frecuency: 'rare',
            stats_percentages: {
                damage: 100,
                precision: 50,
                protection: 100,
                parry: 50
            }
        },
        {
            type: 'paladio',
            frecuency: 'rare',
            stats_percentages: {
                damage: 50,
                precision: 100,
                protection: 50,
                parry: 100
            }
        },
        {
            type: 'mithril',
            frecuency: 'rare',
            stats_percentages: {
                damage: 75,
                precision: 75,
                protection: 0,
                parry: 150
            }
        },
        {
            type: 'titanio',
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
            type: 'oro',
            frecuency: 'extraordinary',
            stats_percentages: {
                damage: 75,
                precision: 125,
                protection: 125,
                parry: 75
            }
        },
        {
            type: 'platino',
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
            type: 'adamantio',
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
const BASE_STATS = {
    damage: 50,
    precision: 100,
    protection: 20,
    parry: 30
};

// Porcentaje de éxito de subir nivel una runa al transmutar runas
const UPGRADES = {
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
