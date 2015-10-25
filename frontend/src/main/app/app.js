(function () {
    'use strict';

    // Módulo principal con sus [dependencias]
    var app = angular.module('kafhe', [
        'ngRoute',
        'ngResource',
        'ngCookies',
        'ngMaterial',
        'ngMessages',
        'kafhe.config',
        'kafhe.controllers',
        'kafhe.services',
        'kafhe.directives',
        'angular-growl',
        'pascalprecht.translate'
    ]);

    //Creo los módulos de controladores, utiles y servicios en blanco, y los iré llenando más adelante
    angular.module('kafhe.config', []);
    angular.module('kafhe.controllers', []);
    angular.module('kafhe.services', []);
    angular.module('kafhe.directives', []);

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

    //Configuración de httpProvider y growls
    app.config(['$httpProvider', 'growlProvider', function ($httpProvider, growlProvider) {
        //Inserto un interceptor para todas las peticiones al httpProvider
        $httpProvider.interceptors.push('KInterceptor');
        // Interceptor para poner mensajes automaticamente, leyendo del servidor un
        // array "messages": [ {"text":"this is a server message", "severity": "warn/info/error"}, "title":"optional" ]
        $httpProvider.interceptors.push(growlProvider.serverMessagesInterceptor);

        growlProvider.globalReversedOrder(true);
        //growlProvider.globalDisableIcons(true);
        growlProvider.globalTimeToLive(5000);
        //growlProvider.globalTimeToLive({success: 1000, error: 2000, warning: 3000, info: 4000});
    }]);

})();