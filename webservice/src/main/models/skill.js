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
            damage_formula: {type: String, default: null},
            precision: {type: Number, default: 0},
            protection: {type: Number, default: 0},
            parry: {type: Number, default: 0}
        },
        action: String
    }, {versionKey: false});

    //Declaro y devuelvo el modelo
    return mongoose.model('Skill', SkillSchema);
};

/*
 skills.insert({ name: 'Habilidad común', element: 'Patata', source: 'common', uses: 3, duration: 2, cost: 3, action: 'a006', _id: ObjectId("5643c879b15c04401e231790"), stats: { parry: 0, protection: 0, precision: 0, damage_formula: null, damage: 5, fury: 10, life: 0 } })
 */
