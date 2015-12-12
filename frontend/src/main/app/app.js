(function () {
    'use strict';

    // Módulo principal con sus [dependencias]
    var app = angular.module('kafhe', [
        'ngRoute',
        'ngResource',
        'ngCookies',
        'ngMaterial',
        'ngMessages',
        'ngDraggable',
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

    app.config(['$logProvider', function ($logProvider) {
        // DEBUG - $log.debug()
        $logProvider.debugEnabled(true);
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

        // Otra itnerpolación para plurarles y genero
        $translateProvider.addInterpolation('$translateMessageFormatInterpolation');
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
        growlProvider.globalDisableCountDown(true);
        //growlProvider.globalTimeToLive({success: 1000, error: 2000, warning: 3000, info: 4000});
    }]);

    // Configuración de color
    app.config(['$mdThemingProvider', function ($mdThemingProvider) {
        var accent = $mdThemingProvider.extendPalette('purple', {
            '500': '4682b4',
            'A700': '4682b4'
        });
        // Register the new color palette map with the name <code>neonRed</code>
        $mdThemingProvider.definePalette('myAccent', accent);

        $mdThemingProvider.theme('default')
            .primaryPalette('teal')
            .accentPalette('indigo')
            .warnPalette('red');
        /*.primaryPalette('teal', {
         'default': '500', // by default use shade 400 from the pink palette for primary intentions
         'hue-1': '50', // use shade 100 for the <code>md-hue-1</code> class
         'hue-2': '700', // use shade 600 for the <code>md-hue-2</code> class
         'hue-3': '900' // use shade A100 for the <code>md-hue-3</code> class
         })
         .accentPalette('blue', {
         'default': '500', // by default use shade 400 from the pink palette for primary intentions
         'hue-1': 'A100', // use shade 100 for the <code>md-hue-1</code> class
         'hue-2': '700', // use shade 600 for the <code>md-hue-2</code> class
         'hue-3': '900' // use shade A100 for the <code>md-hue-3</code> class
         })
         .warnPalette('red', {
         'default': '500', // by default use shade 400 from the pink palette for primary intentions
         'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
         'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
         'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
         })
         .backgroundPalette('grey', {
         'default': '500', // by default use shade 400 from the pink palette for primary intentions
         'hue-1': '200', // use shade 100 for the <code>md-hue-1</code> class
         'hue-2': '700', // use shade 600 for the <code>md-hue-2</code> class
         'hue-3': '900' // use shade A100 for the <code>md-hue-3</code> class
         })*/
    }]);
})();
