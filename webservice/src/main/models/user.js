'use strict';

//Módulo para un modelo de Mongoose. Hay que pasarle el objeto mongoose ya creado antes.
module.exports = function (mongoose) {
    var skillSchema = require('./skillSchema')(mongoose);
    var notificationSchema = require('./notificationSchema')(mongoose);

    //Modelo para los usuarios, coleccion Users
    var UserSchema = mongoose.Schema({
        username: {type: String, unique: true, required: true},
        password: {type: String, select: false, required: true},
        alias: String,
        leader: Boolean,
        times: Number,
        calls: Number,
        avatar: String,
        game: {
            gamedata: {type: mongoose.Schema.Types.ObjectId, ref: 'Game'},
            level: Number,
            tostolares: {type: Number, default: 0},
            stats: {
                life: {type: Number, default: 0},
                fury: {type: Number, default: 0},
                fury_mode: {type: Boolean, default: false},
                reputation: {type: Number, default: 0},
                toast_points: {type: Number, default: 0}
            },
            conditions: [{
                'type': String,
                life: {type: Number, default: 0},
                fury: {type: Number, default: 0},
                charges: {type: Number, default: 0}
            }],
            equipment: {
                weapon: {type: String, default: null},
                armor: {type: String, default: null}
            },
            inventory: {
                tostems: [{
                    id: String,
                    element: {type: String}, // Dejarlo así si llamas al campo type, ya que es palabra reservada y si no peta
                    level: Number,
                    in_use: Boolean
                }],
                runes: [{
                    id: String,
                    material: {type: String},
                    frecuency: String,
                    stats_percentages: {
                        damage: Number,
                        precision: Number,
                        protection: Number,
                        parry: Number
                    },
                    in_use: Boolean
                }],
                weapons: [{
                    id: String,
                    name: String,
                    frecuency: String,
                    level: Number,
                    'class': String, // cortante, perforante, contundente
                    element: String,
                    material: String,
                    base_stats: {
                        damage: Number,
                        precision: Number
                    },
                    components: {
                        rune: String,
                        tostem: String
                    },
                    skills: [skillSchema],
                    equipped: Boolean
                }],
                armors: [{
                    id: String,
                    name: String,
                    frecuency: String,
                    level: Number,
                    'class': String, // pesada, media, ligera
                    element: String,
                    material: String,
                    base_stats: {
                        protection: Number,
                        parry: Number
                    },
                    components: {
                        rune: String,
                        tostem: String
                    },
                    skills: [skillSchema],
                    equipped: Boolean
                }],
                items: [{
                    _id: String,
                    key: String,
                    icon: String,
                    amount: Number,
                    action: String
                }],
                stones: Number
            },
            afk: Boolean,
            last_activity: Number,
            order: {
                meal: {type: mongoose.Schema.Types.ObjectId, ref: 'Meal'},
                drink: {type: mongoose.Schema.Types.ObjectId, ref: 'Drink'},
                ito: Boolean
            },
            last_order: {
                meal: {type: mongoose.Schema.Types.ObjectId, ref: 'Meal'},
                drink: {type: mongoose.Schema.Types.ObjectId, ref: 'Drink'},
                ito: Boolean
            },
            notifications: [notificationSchema]
        }
    }, {versionKey: false});

    //Declaro y devuelvo el modelo
    return mongoose.model('User', UserSchema);
};
