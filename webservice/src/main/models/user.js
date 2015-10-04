'use strict';

//Módulo para un modelo de Mongoose. Hay que pasarle el objeto mongoose ya creado antes.
module.exports = function (mongoose) {

    //Modelo para los usuarios, coleccion Users
    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        session: {
            access_token: String,
            expires_in: Number
        }
    });

    //Declaro y devuelvo el modelo
    return {
        User: mongoose.model('User', UserSchema)
    };
};