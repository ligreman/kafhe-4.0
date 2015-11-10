'use strict';

//Módulo para un modelo de Mongoose. Hay que pasarle el objeto mongoose ya creado antes.
module.exports = function (mongoose) {

    // Modelo para las habilidades de armas y armaduras
    var ObjectSkillSchema = mongoose.Schema({
        id: String,
        name: String,
        element: String,
        level: Number,
        source: String, // common, weapon, armor
        uses: Number,
        duration: Number,
        cost: Number,
        stats: {
            life: {type: Number, default: 0},
            fury: {type: Number, default: 0},
            damage: {type: Number, default: 0},
            precision: {type: Number, default: 0},
            protection: {type: Number, default: 0},
            parry: {type: Number, default: 0}
        },
        blocked: {type: Boolean, default: false},
        action: String
    });

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
                weapon: {type: String, default: null},
                armor: {type: String, default: null}
            },
            inventory: {
                tostems: [{
                    id: String,
                    type: {type: String}, // Dejarlo así ya que type es palabra registrada y si no peta
                    level: Number,
                    equipped: Boolean
                }],
                runes: [{
                    id: String,
                    type: {type: String},
                    frecuency: String,
                    stats_percentages: {
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
                    level: Number,
                    class: String, // cortante, perforante, contundente
                    element: String,
                    base_stats: {
                        damage: Number,
                        precision: Number
                    },
                    materials: {
                        rune: String,
                        tostem: String
                    },
                    skills: [ObjectSkillSchema],
                    equipped: Boolean
                }],
                armors: [{
                    id: String,
                    name: String,
                    frecuency: String,
                    level: Number,
                    class: String, // pesada, media, ligera
                    element: String,
                    base_stats: {
                        protection: Number,
                        parry: Number
                    },
                    materials: {
                        rune: String,
                        tostem: String
                    },
                    skills: [ObjectSkillSchema],
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
    }, {versionKey: false});

    //Declaro y devuelvo el modelo
    return mongoose.model('User', UserSchema);
};
