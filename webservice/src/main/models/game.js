'use strict';

//Módulo para un modelo de Mongoose. Hay que pasarle el objeto mongoose ya creado antes.
module.exports = function (mongoose) {

    //Modelo para los usuarios, coleccion Games
    var GameSchema = mongoose.Schema({
        repeat: Boolean,
        status: {type: Number, default: 0},
        caller: {type: mongoose.Schema.Types.ObjectId, default: null},
        players: [{type: mongoose.Schema.Types.ObjectId}],
        notifications: [{
            message: String,
            timestamp: Number
        }]
    }, {versionKey: false});

    //Declaro y devuelvo el modelo
    return mongoose.model('Game', GameSchema);
};
