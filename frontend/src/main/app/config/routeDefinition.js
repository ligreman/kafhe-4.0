(function () {
    'use strict';

    angular.module('kafhe.config')
        .constant('ROUTES', {
            login: '/',
            loginValidation: '/login',
            error: '/error',
            breakfast: '/breakfast',
            forge: '/forge',
            home: '/home'
        });
})();
