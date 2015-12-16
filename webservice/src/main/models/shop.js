'use strict';

//Módulo para un modelo de Mongoose. Hay que pasarle el objeto mongoose ya creado antes.
module.exports = function (mongoose) {

    //Modelo para los objetos de la tienda, coleccion Shops
    var ShopSchema = mongoose.Schema({
        id: String,
        name: String,
        price: Number,
        icono: String,
        cantidad: Number,
        min_level: {type: Number, default: 0}
    }, {versionKey: false});

    //Declaro y devuelvo el modelo
    return mongoose.model('Shop', ShopSchema);
};
