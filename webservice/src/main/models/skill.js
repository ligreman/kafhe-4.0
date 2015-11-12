'use strict';

//Módulo para un modelo de Mongoose. Hay que pasarle el objeto mongoose ya creado antes.
module.exports = function (mongoose) {

    //Modelo para las habilidades, coleccion Skills
    var skillSchema = require('./skillSchema')(mongoose);

    //Declaro y devuelvo el modelo
    return mongoose.model('Skill', skillSchema);
};

/*
 skills.insert({ name: 'Habilidad común', element: 'Patata', source: 'common', uses: 3, duration: 2, cost: 3, action: 'a006', _id: ObjectId("5643c879b15c04401e231790"), stats: { parry: 0, protection: 0, precision: 0, damage_formula: null, damage: 5, fury: 10, life: 0 } })
 */
