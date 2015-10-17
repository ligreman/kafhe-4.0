'use strict';

//Módulo para un modelo de Mongoose. Hay que pasarle el objeto mongoose ya creado antes.
module.exports = function (mongoose) {

    //Modelo para los usuarios, coleccion Users
    var UserSchema = mongoose.Schema({
        username: {type: String, unique: true, required: true},
        password: {type: String, select: false, required: true},
        alias: String,
        leader: Boolean,
        avatar: String,
        game: {
            gamedata: {type: mongoose.Schema.Types.ObjectId, ref: 'Game'},
            level: Number,
            tostolares: Number,
            stats: {
                life: Number,
                fury: Number,
                fury_mode: Boolean,
                reputation: Number,
                action_points: Number
            },
            equipment: {
                weapon: String,
                armor: String
            },
            inventory: {
                tostems: [{
                    id: String,
                    type: String,
                    level: Number,
                    frecuency: String,
                    stats: {
                        one: Number,
                        two: Number
                    },
                    skills: [], //TODO por definir
                    equipped: Boolean
                }],
                runes: [{
                    id: String,
                    type: String,
                    level: Number,
                    frecuency: String,
                    stats: {
                        damage: Number,
                        precision: Number,
                        protection: Number,
                        parry: Number
                    },
                    equipped: Boolean
                }],
                weapons: [{
                    id: String,
                    name: String,
                    frecuency: String,
                    stats: {
                        damage: Number,
                        precision: Number
                    },
                    materials: {
                        rune: String,
                        tostem: String
                    },
                    skills: [],
                    equipped: Boolean
                }],
                armors: [{
                    id: String,
                    name: String,
                    frecuency: String,
                    stats: {
                        protection: Number,
                        parry: Number
                    },
                    materials: {
                        rune: String,
                        tostem: String
                    },
                    skills: [],
                    equipped: Boolean
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
            }
        }
    });

    //Declaro y devuelvo el modelo
    return mongoose.model('User', UserSchema);
};