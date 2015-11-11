'use strict';

//Módulo para un modelo de Mongoose. Hay que pasarle el objeto mongoose ya creado antes.
module.exports = function (mongoose) {

    //Modelo para las habilidades, coleccion Skills
    var SkillSchema = mongoose.Schema({
        name: String,
        element: String,
        source: String, // weapon, armor
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
        action: String
    }, {versionKey: false});

    //Declaro y devuelvo el modelo
    return mongoose.model('Skill', SkillSchema);
};
