(function () {
    'use strict';

    angular.module('kafhe.config')
        .constant('ROUTES', {
            loginValidation: '/login',
            error: '/error',
            breakfast: '/breakfast',
            home: '/home'
        });
})();