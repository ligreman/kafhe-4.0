'use strict';

module.exports = function (mongoose) {
    var NotificationSchema = mongoose.Schema({
        message: String,
        source: String, // ID del usuario
        'type': String,
        timestamp: Number
    }, {versionKey: false});

    return NotificationSchema;
};
