'use strict';

//Módulo para un modelo de Mongoose. Hay que pasarle el objeto mongoose ya creado antes.
module.exports = function (mongoose) {

    //Modelo para las habilidades, coleccion Skills
    var SkillSchema = mongoose.Schema({
        name: String,
        element: String,
        equipment: String
    }, {versionKey: false});

    //Declaro y devuelvo el modelo
    return mongoose.model('Skill', SkillSchema);
};