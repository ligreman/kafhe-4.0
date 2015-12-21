'use strict';

var fecha = new Date(),
    hora  = fecha.getHours(), //0-23
    dia   = fecha.getDay(); //0-6 siendo 0 domingo

var mongoose = require('mongoose');
var mongoHost = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME || 'mongodb://localhost/kafhe';
mongoose.connect(mongoHost, {});

var User   = require('../models/user')(mongoose),
    config = require('../modules/config');


// A las 2am todos los días
if (hora === 13) {
    User.update({}, {"game.stats.action_points": config.DEFAULTS.TOAST_POINTS}, {multi: true},
        function (error, num) {
            if (error) {
                console.tag('MONGO').error(error);
                return;
            }

            console.tag('CRON-USER-MAINTENANCE').log('Puntos de tueste de los usuarios recargados.');
            process.exit();
        }
    );
} else {
    process.exit();
}
