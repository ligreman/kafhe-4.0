'use strict';

//Módulo para un modelo de Mongoose. Hay que pasarle el objeto mongoose ya creado antes.
module.exports = function (mongoose) {

    //Modelo para los usuarios, coleccion Users
    var UserSchema = mongoose.Schema({
        username: {type: String, unique: true, required: true},
        password: {type: String, select: false, required: true},
        alias: String,
        leader: Boolean,
        lastActivity: Number,
        avatar: String,
        game: {
            gamedata: {type: mongoose.Schema.Types.ObjectId, ref: 'Game'},
            level: Number,
            tostolares: Number,
            stats: {
                life: Number,
                fury: Number,
                furyMode: Boolean,
                reputation: Number,
                actionPoints: Number
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
                    stats: {
                        precision: Number,
                        damage: Number
                    },
                    equipped: Boolean
                }],
                runes: [{
                    id: String,
                    type: String,
                    level: Number,
                    stats: {
                        precision: Number,
                        damage: Number
                    },
                    equipped: Boolean
                }],
                weapons: [{
                    id: String,
                    type: String,
                    level: Number,
                    stats: {
                        precision: Number,
                        damage: Number
                    },
                    materials: {
                        rune: String,
                        tostem: String
                    },
                    equipped: Boolean
                }],
                armors: [{
                    id: String,
                    type: String,
                    level: Number,
                    stats: {
                        precision: Number,
                        damage: Number
                    },
                    materials: {
                        rune: String,
                        tostem: String
                    },
                    equipped: Boolean
                }],
                stones: Number
            },
            afk: Boolean,
            lastActivity: Number,
            order: {
                meal: {type: mongoose.Schema.Types.ObjectId, ref: 'Meal'},
                drink: {type: mongoose.Schema.Types.ObjectId, ref: 'Drink'},
                ito: Boolean
            },
            lastOrder: {
                meal: {type: mongoose.Schema.Types.ObjectId, ref: 'Meal'},
                drink: {type: mongoose.Schema.Types.ObjectId, ref: 'Drink'},
                ito: Boolean
            }
        }
    });

    //Declaro y devuelvo el modelo
    return mongoose.model('User', UserSchema);
};