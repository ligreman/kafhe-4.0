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
            id: 's001',
            name: 'Ataque de pértiga',
            element: 'Salchichonio',
            source: 'weapon',
            uses: 3,
            cost: 3,
            stats: {life: 5}
        },
        {
            id: 's002', name: 'Bola de patatas', element: 'Fuego', source: 'weapon',
            uses: 3,
            cost: 3,
            stats: {protection: 5, parry: 7}
        },
        {
            id: 's003', name: 'Que te pego leche', element: 'Hielo', source: 'armor',
            uses: 3,
            cost: 3,
            stats: {life: 5}
        },
        {
            id: 's004', name: 'Jarl', element: 'Escarcha', source: 'armor',
            uses: 3,
            cost: 3,
            stats: {precision: 5}
        },
        {
            id: 's005', name: 'Mira qué te meto', element: 'Moco', source: 'weapon',
            uses: 3,
            cost: 3,
            stats: {damage: 5, fury: 10}
        },
        {
            id: 's006', name: 'Habilidad común', element: 'Patata', source: 'common',
            uses: 3,
            cost: 3,
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
            password: "1267ea54d8dc193b000d4a86487c7d38b7a55e43", //paco
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
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            equipped: true
                        }, {
                            id: 't002',
                            type: 'water',
                            level: 3,
                            frecuency: 'uncommon',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            equipped: false
                        }, {
                            id: 't003',
                            type: 'earth',
                            level: 4,
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            equipped: false
                        }, {
                            id: 't004',
                            type: 'water',
                            level: 5,
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            equipped: false
                        }, {
                            id: 't005',
                            type: 'light',
                            level: 6,
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            equipped: false
                        }
                    ],
                    runes: [
                        {
                            id: 'r001',
                            type: 'wood',
                            level: 2,
                            frecuency: 'common',
                            stats: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r002',
                            type: 'iron',
                            level: 4,
                            frecuency: 'common',
                            stats: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: false
                        }, {
                            id: 'r003',
                            type: 'steel',
                            level: 5,
                            frecuency: 'masterwork',
                            stats: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: false
                        }, {
                            id: 'r004',
                            type: 'mithril',
                            level: 7,
                            frecuency: 'common',
                            stats: {
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
                            stats: {
                                damage: 14,
                                precision: 6
                            },
                            materials: {
                                rune: 'r001',
                                tostem: 't001'
                            },
                            skills: ['s002'],
                            equipped: true
                        }, {
                            id: 'w002',
                            name: 'Sal Chicha',
                            frecuency: 'legendary',
                            stats: {
                                damage: 54,
                                precision: 64
                            },
                            materials: {
                                rune: 'r002',
                                tostem: 't002'
                            },
                            skills: ['s005'],
                            equipped: false
                        }
                    ],
                    armors: [{
                        id: 'a001',
                        name: 'Al Capa Ra',
                        frecuency: 'common',
                        stats: {
                            protection: 4,
                            parry: 46
                        },
                        materials: {
                            rune: 'r003',
                            tostem: 't003'
                        },
                        skills: ['s003'],
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
            password: "1267ea54d8dc193b000d4a86487c7d38b7a55e43", //paco
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
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: true
                        }, {
                            id: 't002',
                            type: 'water',
                            level: 3,
                            frecuency: 'uncommon',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: true
                        }, {
                            id: 't003',
                            type: 'earth',
                            level: 4,
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: true
                        }, {
                            id: 't004',
                            type: 'water',
                            level: 5,
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: false
                        }, {
                            id: 't005',
                            type: 'light',
                            level: 6,
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: false
                        }
                    ],
                    runes: [
                        {
                            id: 'r001',
                            type: 'wood',
                            level: 2,
                            frecuency: 'common',
                            stats: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r002',
                            type: 'iron',
                            level: 4,
                            frecuency: 'common',
                            stats: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r003',
                            type: 'steel',
                            level: 5,
                            frecuency: 'masterwork',
                            stats: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r004',
                            type: 'mithril',
                            level: 7,
                            frecuency: 'common',
                            stats: {
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
                            name: 'Ten Hedor2',
                            frecuency: 'common',
                            stats: {
                                damage: 14,
                                precision: 6
                            },
                            materials: {
                                rune: 'r001',
                                tostem: 't001'
                            },
                            skills: [],
                            equipped: true
                        }, {
                            id: 'w002',
                            name: 'Sal Chicha2',
                            frecuency: 'legendary',
                            stats: {
                                damage: 54,
                                precision: 64
                            },
                            materials: {
                                rune: 'r002',
                                tostem: 't002'
                            },
                            skills: [],
                            equipped: false
                        }
                    ],
                    armors: [{
                        id: 'a001',
                        name: 'Al Capa Ra2',
                        frecuency: 'common',
                        stats: {
                            protection: 4,
                            parry: 46
                        },
                        materials: {
                            rune: 'r003',
                            tostem: 't003'
                        },
                        skills: [],
                        equipped: true
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
            password: "1267ea54d8dc193b000d4a86487c7d38b7a55e43", //paco
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
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: true
                        }, {
                            id: 't002',
                            type: 'water',
                            level: 3,
                            frecuency: 'uncommon',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: true
                        }, {
                            id: 't003',
                            type: 'earth',
                            level: 4,
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: true
                        }, {
                            id: 't004',
                            type: 'water',
                            level: 5,
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: false
                        }, {
                            id: 't005',
                            type: 'light',
                            level: 6,
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: false
                        }
                    ],
                    runes: [
                        {
                            id: 'r001',
                            type: 'wood',
                            level: 2,
                            frecuency: 'common',
                            stats: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r002',
                            type: 'iron',
                            level: 4,
                            frecuency: 'common',
                            stats: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r003',
                            type: 'steel',
                            level: 5,
                            frecuency: 'masterwork',
                            stats: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r004',
                            type: 'mithril',
                            level: 7,
                            frecuency: 'common',
                            stats: {
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
                            stats: {
                                damage: 14,
                                precision: 6
                            },
                            materials: {
                                rune: 'r001',
                                tostem: 't001'
                            },
                            skills: [],
                            equipped: true
                        }, {
                            id: 'w002',
                            name: 'Sal Chicha',
                            frecuency: 'legendary',
                            stats: {
                                damage: 54,
                                precision: 64
                            },
                            materials: {
                                rune: 'r002',
                                tostem: 't002'
                            },
                            skills: [],
                            equipped: false
                        }
                    ],
                    armors: [{
                        id: 'a001',
                        name: 'Al Capa Ra',
                        frecuency: 'common',
                        stats: {
                            protection: 4,
                            parry: 46
                        },
                        materials: {
                            rune: 'r003',
                            tostem: 't003'
                        },
                        skills: [],
                        equipped: true
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
            password: "1267ea54d8dc193b000d4a86487c7d38b7a55e43", //paco
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
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: true
                        }, {
                            id: 't002',
                            type: 'water',
                            level: 3,
                            frecuency: 'uncommon',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: true
                        }, {
                            id: 't003',
                            type: 'earth',
                            level: 4,
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: true
                        }, {
                            id: 't004',
                            type: 'water',
                            level: 5,
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: false
                        }, {
                            id: 't005',
                            type: 'light',
                            level: 6,
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: false
                        }
                    ],
                    runes: [
                        {
                            id: 'r001',
                            type: 'wood',
                            level: 2,
                            frecuency: 'common',
                            stats: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r002',
                            type: 'iron',
                            level: 4,
                            frecuency: 'common',
                            stats: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r003',
                            type: 'steel',
                            level: 5,
                            frecuency: 'masterwork',
                            stats: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r004',
                            type: 'mithril',
                            level: 7,
                            frecuency: 'common',
                            stats: {
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
                            stats: {
                                damage: 14,
                                precision: 6
                            },
                            materials: {
                                rune: 'r001',
                                tostem: 't001'
                            },
                            skills: [],
                            equipped: true
                        }, {
                            id: 'w002',
                            name: 'Sal Chicha',
                            frecuency: 'legendary',
                            stats: {
                                damage: 54,
                                precision: 64
                            },
                            materials: {
                                rune: 'r002',
                                tostem: 't002'
                            },
                            skills: [],
                            equipped: false
                        }
                    ],
                    armors: [{
                        id: 'a001',
                        name: 'Al Capa Ra',
                        frecuency: 'common',
                        stats: {
                            protection: 4,
                            parry: 46
                        },
                        materials: {
                            rune: 'r003',
                            tostem: 't003'
                        },
                        skills: [],
                        equipped: true
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
            password: "1267ea54d8dc193b000d4a86487c7d38b7a55e43", //paco
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
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: true
                        }, {
                            id: 't002',
                            type: 'water',
                            level: 3,
                            frecuency: 'uncommon',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: true
                        }, {
                            id: 't003',
                            type: 'earth',
                            level: 4,
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: true
                        }, {
                            id: 't004',
                            type: 'fire',
                            level: 5,
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: false
                        }, {
                            id: 't005',
                            type: 'light',
                            level: 6,
                            frecuency: 'common',
                            stats: {
                                one: 12,
                                two: 43
                            },
                            skills: [],
                            equipped: false
                        }
                    ],
                    runes: [
                        {
                            id: 'r001',
                            type: 'wood',
                            level: 2,
                            frecuency: 'common',
                            stats: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r002',
                            type: 'iron',
                            level: 4,
                            frecuency: 'common',
                            stats: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r003',
                            type: 'steel',
                            level: 5,
                            frecuency: 'masterwork',
                            stats: {
                                damage: 12,
                                precision: 33,
                                protection: 56,
                                parry: 45
                            },
                            equipped: true
                        }, {
                            id: 'r004',
                            type: 'mithril',
                            level: 7,
                            frecuency: 'common',
                            stats: {
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
                            stats: {
                                damage: 14,
                                precision: 6
                            },
                            materials: {
                                rune: 'r001',
                                tostem: 't001'
                            },
                            skills: [],
                            equipped: true
                        }, {
                            id: 'w002',
                            name: 'Sal Chicha',
                            frecuency: 'legendary',
                            stats: {
                                damage: 54,
                                precision: 64
                            },
                            materials: {
                                rune: 'r002',
                                tostem: 't002'
                            },
                            skills: [],
                            equipped: false
                        }
                    ],
                    armors: [{
                        id: 'a001',
                        name: 'Al Capa Ra',
                        frecuency: 'common',
                        stats: {
                            protection: 4,
                            parry: 46
                        },
                        materials: {
                            rune: 'r003',
                            tostem: 't003'
                        },
                        skills: [],
                        equipped: true
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
