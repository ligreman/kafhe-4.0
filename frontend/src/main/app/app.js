(function () {
    'use strict';

    // Módulo principal con sus [dependencias]
    var app = angular.module('kafhe', [
        'ngRoute',
        'ngResource',
        'ngCookies',
        'ngMaterial',
        'kafhe.config',
        'kafhe.controllers',
        'kafhe.services',
        'angular-growl',
        'pascalprecht.translate'
    ]);

    //Creo los módulos de controladores, utiles y servicios en blanco, y los iré llenando más adelante
    angular.module('kafhe.config', []);
    angular.module('kafhe.controllers', []);
    angular.module('kafhe.services', []);

    //Para controles que hay que hacer cuando se cambia de ruta, por ejemplo autenticación
    app.run(['$rootScope', 'KSession', function ($rootScope, KSession) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            //A ver si a donde voy requiere que esté autenticado
            if (next.access !== undefined && next.access.loginRequired) {
                //TODO Aquí puedo comprobar si requiere o no que sea admin

                //Compruebo que estoy autorizado para ver la página que quiero ver
                KSession.authorize();
            }
        });

    }]);


    //Configuramos el idioma por defecto
    app.config(['$translateProvider', 'CONFIG', function ($translateProvider, CONFIG) {
        //Indicamos que sanee las cadenas usadas, el idioma por defecto, el idioma
        // de fallback (si no encuentra una cadena en el idioma actual la busca en el de fallback,
        // e indicamos que usaremos cookies para guardar la elección del usuario
        $translateProvider
            .useSanitizeValueStrategy('escape')
            .preferredLanguage(CONFIG.defaultLanguage)
            .fallbackLanguage(CONFIG.fallbackLanguage)
            .useCookieStorage();
    }]);

    //Configuración de httpProvider
    app.config(['$httpProvider', function ($httpProvider) {
        //Inserto un interceptor para todas las peticiones al httpProvider
        $httpProvider.interceptors.push('KInterceptor');
    }]);

    //Configuración de Growls
    app.config(['growlProvider', function (growlProvider) {
        growlProvider.globalReversedOrder(true);
    }]);

})();