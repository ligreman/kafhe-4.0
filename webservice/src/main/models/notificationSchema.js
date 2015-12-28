'use strict';

module.exports = function (mongoose) {
    var NotificationSchema = mongoose.Schema({
        message: mongoose.Schema.Types.Mixed,
        //source: mongoose.Schema.Types.ObjectId,
        'type': String,
        timestamp: Number
    }, {versionKey: false});

    return NotificationSchema;
};
