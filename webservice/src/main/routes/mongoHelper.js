'use strict';

module.exports = function (app) {
    var console = process.console;

    var express      = require('express'),
        passport     = require('passport'),
        events       = require('events'),
        eventEmitter = new events.EventEmitter(),
        mongoRouter  = express.Router(),
        mongoose     = require('mongoose'),
        utils        = require('../modules/utils'),
        models       = require('../models/models')(mongoose);

    // Modelos
    var admins = [
        {username: "admin", password: "admin"}
    ];

    var meals = [
        {name: 'Plátano', ito: false},
        {name: 'Bocata', ito: true},
        {name: 'Salchicha', ito: true},
        {name: 'Tortilla con chorizo', ito: true},
        {name: 'Tortilla con cebolla', ito: true},
        {name: 'Pulga de pollo queso', ito: true},
        {name: 'Pulga de perro asado', ito: true},
        {name: 'Peperoni', ito: false}
    ];

    var drinks = [
        {name: 'Té con leche', ito: false},
        {name: 'Café con leche', ito: true},
        {name: 'Té americano', ito: true},
        {name: 'Zumo de pera', ito: true}
    ];

    var skills = [
        {
            name: 'Ataque de pértiga',
            element: 'Salchichonio',
            source: 'weapon',
            uses: 3, duration: 2,
            cost: 3, action: 'a001',
            stats: {life: 5}
        },
        {
            name: 'Bola de patatas', element: 'fire', source: 'weapon',
            uses: 3, duration: 2,
            cost: 3, action: 'a002',
            stats: {protection: 5, parry: 7}
        },
        {
            name: 'Que te pego leche', element: 'Hielo', source: 'armor',
            uses: 3, duration: 2,
            cost: 3, action: 'a003',
            stats: {life: 5}
        },
        {
            name: 'Jarl', element: 'Escarcha', source: 'armor',
            uses: 3, duration: 2,
            cost: 3, action: 'a004',
            stats: {precision: 5}
        },
        {
            name: 'Mira qué te meto', element: 'Moco', source: 'weapon',
            uses: 3, duration: 2,
            cost: 3, action: 'a005',
            stats: {damage: 5, fury: 10}
        },
        {
            name: 'Habilidad común', element: 'Patata', source: 'common',
            uses: 3, duration: 2,
            cost: 3, action: 'a006',
            stats: {damage: 5, fury: 10}
        }
    ];


    var date = new Date();
    var game = {
        repeat: true,
        status: 0,
        caller: null,
        players: null,
        notifications: [
            {
                message: 'orem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id augue odio. Integer luctus, lacus nec facilisis euismod, diam nisl auctor lorem, eleifend imperdiet urna nunc et velit. Maecenas mollis in urna vitae accumsan. Pellentesque viverra odio id nisl lacinia, nec pharetra nunc ullamcorper. Ut laoreet, nibh eu accumsan lacinia, tellus sem lacinia ante, id bibendum ante metus ut nunc.',
                timestamp: date.getTime() + 10000
            }, {
                message: 'orem ipsum dolor sit er luctus, lacus nec facilend imperdiet urna nunc et velit. Maecenas mollis in urna vitae accumsan. Pellentesque viverra odio id nisl lacinia, nec pharetra nunc ullamcorper. Ut laoreet, nibh eu accumsan lacinia, tellus sem lacinia ante, id bibendum ante metus ut nunc.',
                timestamp: date.getTime() + 1000
            }, {
                message: 'orem ipsum dolor sit amet, consecteer luctus, lacus ne auctor lorem, eleifend imperdiet urna nunc et velit. Maecenas mollis in urna vitae accumsan. Pellentesque viverra odio id nisl lacinia, nec pharetra nunc ullamcorper. Ut laoreet, nibh eu accumsan lacinia, tellus sem lacinia ante, id bibendum ante metus ut nunc.',
                timestamp: date.getTime() + 1000
            }, {
                message: 'orem elit. Morbi id augue odio. Integer luctus, lei vitae accumsan. Pellentesque viverra odio id nisl lacinia, nec pharetra nunc ullamcorper. Ut laoreet, nibh eu accumsan lacinia, tellus sem lacinia ante, id bibendum ante metus ut nunc.',
                timestamp: date.getTime() + 1000
            }
        ]
    };

    var users = [
        {
            username: 'pepe1',
            password: "d404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db", //1234
            alias: 'Antoñete',
            leader: true,
            avatar: 'http://findicons.com/files/icons/1072/face_avatars/300/j01.png',
            game: {
                gamedata: null,
                level: 2,
                tostolares: 1000,
                stats: {
                    life: 100,
                    fury: 76,
                    fury_mode: false,
                    reputation: 23,
                    action_points: 12
                },
                equipment: {
                    weapon: 'w001',
                    armor: null
                },
                inventory: {
                    tostems: [
                        {
                            id: 't001',
                            type: 'fire',
                            level: 2,
                            equipped: true
                        }, {
                            id: 't002',
                            type: 'water',
                            level: 3,
                            equipped: false
                        }, {
                            id: 't003',
                            type: 'earth',
                            level: 4,
                            equipped: false
                        }, {
                            id: 't004',
                            type: 'water',
                            level: 5,
                            equipped: false
                        }, {
                            id: 't005',
                            type: 'air',
                            level: 6,
                            equipped: false
                        }
                    ],
                    runes: [
                        {
                            id: 'r001',
                            type: 'madera',
                            frecuency: 'common',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r002',
                            type: 'madera',
                            frecuency: 'common',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: false
                        }, {
                            id: 'r003',
                            type: 'madera',
                            frecuency: 'uncommon',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: false
                        }, {
                            id: 'r004',
                            type: 'mithril',
                            frecuency: 'uncommon',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: false
                        }
                    ],
                    weapons: [
                        {
                            id: 'w001',
                            name: 'Ten Hedor',
                            frecuency: 'common',
                            level: 2, base_stats: {
                            damage: 14,
                            precision: 6
                        },
                            materials: {
                                rune: 'r001',
                                tostem: 't001'
                            },
                            skills: [{
                                id: 's001',
                                name: 'Papachiro in the face',
                                element: 'fire',
                                level: 1,
                                source: 'weapon', // common, weapon, armor
                                uses: 3,
                                cost: 2, action: 'a001', duration: 2,
                                stats: {
                                    damage: 20
                                },
                                blocked: false
                            }],
                            equipped: true
                        }, {
                            id: 'w002',
                            name: 'Sal Chicha',
                            frecuency: 'legendary',
                            level: 2, base_stats: {
                                damage: 54,
                                precision: 64
                            },
                            materials: {
                                rune: 'r002',
                                tostem: 't002'
                            },
                            skills: [{
                                id: 's003',
                                name: 'Ataquito in the ice',
                                element: 'water',
                                level: 1,
                                source: 'weapon', // common, weapon, armor
                                uses: 1,
                                cost: 3, action: 'a001', duration: 2,
                                stats: {
                                    damage: 60
                                },
                                blocked: false
                            }],
                            equipped: false
                        }
                    ],
                    armors: [{
                        id: 'a001',
                        name: 'Al Capa Ra',
                        frecuency: 'common',
                        level: 2, base_stats: {
                            protection: 4,
                            parry: 46
                        },
                        materials: {
                            rune: 'r003',
                            tostem: 't003'
                        },
                        skills: [{
                            id: 's002',
                            name: 'Escudito in the back',
                            element: 'earth',
                            level: 2,
                            source: 'armor', // common, weapon, armor
                            uses: 3,
                            cost: 1,
                            stats: {
                                protection: 10,
                                parry: 5
                            },
                            blocked: false
                        }],
                        equipped: false
                    }],
                    stones: 23
                },
                afk: false,
                last_activity: date.getTime(),
                order: {
                    meal: null,
                    drink: null,
                    ito: true
                },
                last_order: {
                    meal: null,
                    drink: null,
                    ito: false
                }
            }
        }, {
            username: 'pepe2',
            password: "d404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db", //paco
            alias: 'Manolin',
            leader: true,
            avatar: 'http://findicons.com/files/icons/1072/face_avatars/300/j01.png',
            game: {
                gamedata: null,
                level: 2,
                tostolares: 1000,
                stats: {
                    life: 100,
                    fury: 76,
                    fury_mode: false,
                    reputation: 23,
                    action_points: 12
                },
                equipment: {
                    weapon: 'w001',
                    armor: 'a001'
                },
                inventory: {
                    tostems: [
                        {
                            id: 't001',
                            type: 'fire',
                            level: 2,
                            equipped: true
                        }, {
                            id: 't002',
                            type: 'water',
                            level: 3,
                            equipped: true
                        }, {
                            id: 't003',
                            type: 'earth',
                            level: 4,
                            equipped: true
                        }, {
                            id: 't004',
                            type: 'water',
                            level: 5,
                            equipped: false
                        }, {
                            id: 't005',
                            type: 'light',
                            level: 6,
                            equipped: false
                        }
                    ],
                    runes: [
                        {
                            id: 'r001',
                            type: 'wood',
                            frecuency: 'common',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r002',
                            type: 'iron',
                            frecuency: 'common',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r003',
                            type: 'steel',
                            frecuency: 'uncommon',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r004',
                            type: 'mithril',
                            frecuency: 'common',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: false
                        }
                    ],
                    weapons: [
                        {
                            id: 'w001',
                            name: 'Ten Hedor',
                            frecuency: 'common',
                            level: 2, base_stats: {
                            damage: 14,
                            precision: 6
                        },
                            materials: {
                                rune: 'r001',
                                tostem: 't001'
                            },
                            skills: [{
                                id: 's001',
                                name: 'Papachiro in the face',
                                element: 'fire',
                                level: 1,
                                source: 'weapon', // common, weapon, armor
                                uses: 3,
                                cost: 2, action: 'a001', duration: 2,
                                stats: {
                                    damage: 20
                                },
                                blocked: false
                            }],
                            equipped: true
                        }, {
                            id: 'w002',
                            name: 'Sal Chicha',
                            frecuency: 'legendary',
                            level: 2, base_stats: {
                                damage: 54,
                                precision: 64
                            },
                            materials: {
                                rune: 'r002',
                                tostem: 't002'
                            },
                            skills: [{
                                id: 's003',
                                name: 'Ataquito in the ice',
                                element: 'water',
                                level: 1,
                                source: 'weapon', // common, weapon, armor
                                uses: 1,
                                cost: 3, action: 'a001', duration: 2,
                                stats: {
                                    damage: 60
                                },
                                blocked: false
                            }],
                            equipped: false
                        }
                    ],
                    armors: [{
                        id: 'a001',
                        name: 'Al Capa Ra',
                        frecuency: 'common',
                        level: 2, base_stats: {
                            protection: 4,
                            parry: 46
                        },
                        materials: {
                            rune: 'r003',
                            tostem: 't003'
                        },
                        skills: [{
                            id: 's002',
                            name: 'Escudito in the back',
                            element: 'earth',
                            level: 2,
                            source: 'armor', // common, weapon, armor
                            uses: 3,
                            cost: 1,
                            stats: {
                                protection: 10,
                                parry: 5
                            },
                            blocked: false
                        }],
                        equipped: false
                    }],
                    stones: 23
                },
                afk: false,
                last_activity: date.getTime(),
                order: {
                    meal: null,
                    drink: null,
                    ito: true
                },
                last_order: {
                    meal: null,
                    drink: null,
                    ito: false
                }
            }
        }, {
            username: 'pepe3',
            password: "d404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db", //paco
            alias: 'Felisuco',
            leader: true,
            avatar: 'http://findicons.com/files/icons/1072/face_avatars/300/j01.png',
            game: {
                gamedata: null,
                level: 2,
                tostolares: 1000,
                stats: {
                    life: 100,
                    fury: 76,
                    fury_mode: false,
                    reputation: 23,
                    action_points: 12
                },
                equipment: {
                    weapon: 'w001',
                    armor: 'a001'
                },
                inventory: {
                    tostems: [
                        {
                            id: 't001',
                            type: 'fire',
                            level: 2,
                            equipped: true
                        }, {
                            id: 't002',
                            type: 'water',
                            level: 3,
                            equipped: true
                        }, {
                            id: 't003',
                            type: 'earth',
                            level: 4,
                            equipped: true
                        }, {
                            id: 't004',
                            type: 'water',
                            level: 5,
                            equipped: false
                        }, {
                            id: 't005',
                            type: 'light',
                            level: 6,
                            equipped: false
                        }
                    ],
                    runes: [
                        {
                            id: 'r001',
                            type: 'wood',
                            frecuency: 'common',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r002',
                            type: 'iron',
                            frecuency: 'common',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r003',
                            type: 'steel',
                            frecuency: 'uncommon',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r004',
                            type: 'mithril',
                            frecuency: 'common',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: false
                        }
                    ],
                    weapons: [
                        {
                            id: 'w001',
                            name: 'Ten Hedor',
                            frecuency: 'common',
                            level: 2, base_stats: {
                            damage: 14,
                            precision: 6
                        },
                            materials: {
                                rune: 'r001',
                                tostem: 't001'
                            },
                            skills: [{
                                id: 's001',
                                name: 'Papachiro in the face',
                                element: 'fire',
                                level: 1,
                                source: 'weapon', // common, weapon, armor
                                uses: 3,
                                cost: 2, action: 'a001', duration: 2,
                                stats: {
                                    damage: 20
                                },
                                blocked: false
                            }],
                            equipped: true
                        }, {
                            id: 'w002',
                            name: 'Sal Chicha',
                            frecuency: 'legendary',
                            level: 2, base_stats: {
                                damage: 54,
                                precision: 64
                            },
                            materials: {
                                rune: 'r002',
                                tostem: 't002'
                            },
                            skills: [{
                                id: 's003',
                                name: 'Ataquito in the ice',
                                element: 'water',
                                level: 1,
                                source: 'weapon', // common, weapon, armor
                                uses: 1,
                                cost: 3, action: 'a001', duration: 2,
                                stats: {
                                    damage: 60
                                },
                                blocked: false
                            }],
                            equipped: false
                        }
                    ],
                    armors: [{
                        id: 'a001',
                        name: 'Al Capa Ra',
                        frecuency: 'common',
                        level: 2, base_stats: {
                            protection: 4,
                            parry: 46
                        },
                        materials: {
                            rune: 'r003',
                            tostem: 't003'
                        },
                        skills: [{
                            id: 's002',
                            name: 'Escudito in the back',
                            element: 'earth',
                            level: 2,
                            source: 'armor', // common, weapon, armor
                            uses: 3,
                            cost: 1,
                            stats: {
                                protection: 10,
                                parry: 5
                            },
                            blocked: false
                        }],
                        equipped: false
                    }],
                    stones: 23
                },
                afk: false,
                last_activity: date.getTime(),
                order: {
                    meal: null,
                    drink: null,
                    ito: true
                },
                last_order: {
                    meal: null,
                    drink: null,
                    ito: false
                }
            }
        }, {
            username: 'pepe4',
            password: "d404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db", //paco
            alias: 'Jolines',
            leader: true,
            avatar: 'http://findicons.com/files/icons/1072/face_avatars/300/j01.png',
            game: {
                gamedata: null,
                level: 2,
                tostolares: 1000,
                stats: {
                    life: 100,
                    fury: 76,
                    fury_mode: false,
                    reputation: 23,
                    action_points: 12
                },
                equipment: {
                    weapon: 'w001',
                    armor: 'a001'
                },
                inventory: {
                    tostems: [
                        {
                            id: 't001',
                            type: 'fire',
                            level: 2,
                            equipped: true
                        }, {
                            id: 't002',
                            type: 'water',
                            level: 3,
                            equipped: true
                        }, {
                            id: 't003',
                            type: 'earth',
                            level: 4,
                            equipped: true
                        }, {
                            id: 't004',
                            type: 'water',
                            level: 5,
                            equipped: false
                        }, {
                            id: 't005',
                            type: 'light',
                            level: 6,
                            equipped: false
                        }
                    ],
                    runes: [
                        {
                            id: 'r001',
                            type: 'wood',
                            frecuency: 'common',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r002',
                            type: 'iron',
                            frecuency: 'common',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r003',
                            type: 'steel',
                            frecuency: 'uncommon',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r004',
                            type: 'mithril',
                            frecuency: 'common',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: false
                        }
                    ],
                    weapons: [
                        {
                            id: 'w001',
                            name: 'Ten Hedor',
                            frecuency: 'common',
                            level: 2, base_stats: {
                            damage: 14,
                            precision: 6
                        },
                            materials: {
                                rune: 'r001',
                                tostem: 't001'
                            },
                            skills: [{
                                id: 's001',
                                name: 'Papachiro in the face',
                                element: 'fire',
                                level: 1,
                                source: 'weapon', // common, weapon, armor
                                uses: 3,
                                cost: 2, action: 'a001', duration: 2,
                                stats: {
                                    damage: 20
                                },
                                blocked: false
                            }],
                            equipped: true
                        }, {
                            id: 'w002',
                            name: 'Sal Chicha',
                            frecuency: 'legendary',
                            level: 2, base_stats: {
                                damage: 54,
                                precision: 64
                            },
                            materials: {
                                rune: 'r002',
                                tostem: 't002'
                            },
                            skills: [{
                                id: 's003',
                                name: 'Ataquito in the ice',
                                element: 'water',
                                level: 1,
                                source: 'weapon', // common, weapon, armor
                                uses: 1,
                                cost: 3, action: 'a001', duration: 2,
                                stats: {
                                    damage: 60
                                },
                                blocked: false
                            }],
                            equipped: false
                        }
                    ],
                    armors: [{
                        id: 'a001',
                        name: 'Al Capa Ra',
                        frecuency: 'common',
                        level: 2, base_stats: {
                            protection: 4,
                            parry: 46
                        },
                        materials: {
                            rune: 'r003',
                            tostem: 't003'
                        },
                        skills: [{
                            id: 's002',
                            name: 'Escudito in the back',
                            element: 'earth',
                            level: 2,
                            source: 'armor', // common, weapon, armor
                            uses: 3,
                            cost: 1,
                            stats: {
                                protection: 10,
                                parry: 5
                            },
                            blocked: false
                        }],
                        equipped: false
                    }],
                    stones: 23
                },
                afk: false,
                last_activity: date.getTime(),
                order: {
                    meal: null,
                    drink: null,
                    ito: true
                },
                last_order: {
                    meal: null,
                    drink: null,
                    ito: false
                }
            }
        }, {
            username: 'pepe5',
            password: "d404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db", //paco
            alias: 'Si tu lo dices',
            leader: true,
            avatar: 'http://findicons.com/files/icons/1072/face_avatars/300/j01.png',
            game: {
                gamedata: null,
                level: 2,
                tostolares: 1000,
                stats: {
                    life: 100,
                    fury: 76,
                    fury_mode: false,
                    reputation: 23,
                    action_points: 12
                },
                equipment: {
                    weapon: 'w001',
                    armor: 'a001'
                },
                inventory: {
                    tostems: [
                        {
                            id: 't001',
                            type: 'fire',
                            level: 2,
                            equipped: true
                        }, {
                            id: 't002',
                            type: 'water',
                            level: 2,
                            equipped: true
                        }, {
                            id: 't003',
                            type: 'earth',
                            level: 4,
                            equipped: true
                        }, {
                            id: 't004',
                            type: 'fire',
                            level: 5,
                            equipped: false
                        }, {
                            id: 't005',
                            type: 'light',
                            level: 6,
                            equipped: false
                        }
                    ],
                    runes: [
                        {
                            id: 'r001',
                            type: 'woody',
                            frecuency: 'common',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r002',
                            type: 'irony',
                            frecuency: 'common',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r003',
                            type: 'steely',
                            frecuency: 'uncommon',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r004',
                            type: 'mithrily',
                            frecuency: 'common',
                            stats_percentages: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: false
                        }
                    ],
                    weapons: [
                        {
                            id: 'w001',
                            name: 'Ten Hedor',
                            frecuency: 'common',
                            level: 2, base_stats: {
                            damage: 14,
                            precision: 6
                        },
                            materials: {
                                rune: 'r001',
                                tostem: 't001'
                            },
                            skills: [{
                                id: 's001',
                                name: 'Papachiro in the face',
                                element: 'fire',
                                level: 1,
                                source: 'weapon', // common, weapon, armor
                                uses: 3,
                                cost: 2, action: 'a001', duration: 2,
                                stats: {
                                    damage: 20
                                },
                                blocked: false
                            }],
                            equipped: true
                        }, {
                            id: 'w002',
                            name: 'Sal Chicha',
                            frecuency: 'legendary',
                            level: 2, base_stats: {
                                damage: 54,
                                precision: 64
                            },
                            materials: {
                                rune: 'r002',
                                tostem: 't002'
                            },
                            skills: [{
                                id: 's003',
                                name: 'Ataquito in the ice',
                                element: 'water',
                                level: 1,
                                source: 'weapon', // common, weapon, armor
                                uses: 1,
                                cost: 3, action: 'a001', duration: 2,
                                stats: {
                                    damage: 60
                                },
                                blocked: false
                            }],
                            equipped: false
                        }
                    ],
                    armors: [{
                        id: 'a001',
                        name: 'Al Capa Ra',
                        frecuency: 'common',
                        level: 2, base_stats: {
                            protection: 4,
                            parry: 46
                        },
                        materials: {
                            rune: 'r003',
                            tostem: 't003'
                        },
                        skills: [{
                            id: 's002',
                            name: 'Escudito in the back',
                            element: 'earth',
                            level: 2,
                            source: 'armor', // common, weapon, armor
                            uses: 3,
                            cost: 1,
                            stats: {
                                protection: 10,
                                parry: 5
                            },
                            blocked: false
                        }],
                        equipped: false
                    }],
                    stones: 23
                },
                afk: false,
                last_activity: date.getTime(),
                order: {
                    meal: null,
                    drink: null,
                    ito: true
                },
                last_order: {
                    meal: null,
                    drink: null,
                    ito: false
                }
            }
        }
    ];

    // ROUTER
    mongoRouter.get('/', function (req, res, next) {
        console.log('Inicio');
        models.Admin.remove({}, function (err) {
            //Meto los nuevos valores
            models.Admin.create(admins, function (err, admins) {
                eventEmitter.emit('#1', res);
            });
        });
    });

    //eventEmitter.setMaxListeners(20);
    //console.log('Listeners: ' + eventEmitter.getMaxListeners());

    //Eventos
    eventEmitter.on('#1', function (res) {
        console.log('#1');
        //Limpio la colección antes
        models.Meal.remove({}, function (err) {
            //Meto los nuevos valores
            models.Meal.create(meals, function (err, meals) {
                console.log("Emit #2");
                eventEmitter.emit('#2', {
                    res: res,
                    meals: meals
                });

            });
        });
    });

    eventEmitter.on('#2', function (data) {
        console.log('#2');
        models.Drink.remove({}, function (err) {
            //Meto los nuevos valores
            models.Drink.create(drinks, function (err, drinks) {
                //res.json({"mongo": true, meals: meals});
                eventEmitter.emit('#3', {
                    res: data.res,
                    meals: data.meals,
                    drinks: drinks
                });

            });
        });
    });

    eventEmitter.on('#3', function (data) {
        console.log('#3');
        models.Skill.remove({}, function (err) {
            //Meto los nuevos valores
            models.Skill.create(skills, function (err, skills) {
                //res.json({"mongo": true, meals: meals});
                eventEmitter.emit('#4', {
                    res: data.res,
                    meals: data.meals,
                    drinks: data.drinks,
                    skills: skills
                });

            });
        });
    });

    eventEmitter.on('#4', function (data) {
        console.log('#4');
        models.Game.remove({}, function (err) {
            console.log(err);
            //Meto los nuevos valores
            models.Game.create(game, function (err, game) {
                console.log(err);

                eventEmitter.emit('#5', {
                    res: data.res,
                    meals: data.meals,
                    drinks: data.drinks,
                    skills: data.skills,
                    game: game
                });

            });
        });
    });

    eventEmitter.on('#5', function (data) {
        console.log('#5');
        models.User.remove({}, function (err) {
            console.log(err);
            //Meto los nuevos valores
            models.User.create(users, function (err, users) {
                console.log(err);
                //res.json({"mongo": true, meals: meals});
                eventEmitter.emit('#6', {
                    res: data.res,
                    meals: data.meals,
                    drinks: data.drinks,
                    skills: data.skills,
                    game: data.game,
                    users: users
                });

            });
        });
    });

    eventEmitter.on('#6', function (data) {
        console.log('#6');
        var arrPla = [];

        data.users.forEach(function (user) {
            console.log("IDS");
            console.log(user._id.toString());
            arrPla.push(user._id);
        });

        models.Game.update({}, {$set: {"players": arrPla}}, function (err) {
            console.log(err);
            console.log("UPDATED GAME");
            eventEmitter.emit('#7', data);
        });
    });

    eventEmitter.on('#7', function (data) {
        console.log('#7');
        models.User.update({}, {
            $set: {
                "game.gamedata": data.game._id,
                "game.order.meal": data.meals[utils.randomInt(0, 7)]._id,
                "game.order.drink": data.drinks[utils.randomInt(0, 3)]._id
            }
        }, {multi: true}, function (err) {
            console.log("UPDATED USERS");
            console.log(err);

            data.res.json({"mongo": true});
        });
    });

    // Asigno los router a sus rutas
    app.use('/mongo/fake', mongoRouter);


}
;

//Use new Aggregate({ $match: { _id: mongoose.Schema.Types.ObjectId('00000000000000000000000a') } }); instead.
