(function () {
    'use strict';

    // módulo que contiene Strings de configuración
    angular.module('kafhe.config')
        .constant('CONFIG', {
            webServiceUrl: 'http://dev-63-3-slc.inteco.es:8080/SLCWebservice/api/slc/',

            // IDIOMAS
            defaultLanguage: 'es',
            fallbackLanguage: 'es',
            languages: {
                spanish: 'es',
                english: 'en'
            },

            // Seguridad
            sessionCookieName: 'kafhe-gallet',
            //Códigos de error de sesión, que provocarán que se eche al usuario a la página de login
            errorCodesSession: [
                'errSessionUtils0002', 'errSessionUtils0003', 'errToken0001',
                'errValidUser0001', 'errValidUser0002', 'errValidUser0003', 'errValidUser0004',
                'errValidSession0002', 'errNoSession'
            ]
        });
})();