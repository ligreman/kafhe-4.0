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
    app.config(['$translateProvider', '$logProvider', 'CONFIG', function ($translateProvider, $logProvider, CONFIG) {
        //Indicamos que sanee las cadenas usadas, el idioma por defecto, el idioma
        // de fallback (si no encuentra una cadena en el idioma actual la busca en el de fallback,
        // e indicamos que usaremos cookies para guardar la elección del usuario
        $translateProvider
            .useSanitizeValueStrategy('escape')
            .preferredLanguage(CONFIG.defaultLanguage)
            .fallbackLanguage(CONFIG.fallbackLanguage)
            .useCookieStorage();

        // DEBUG - $log.debug()
        $logProvider.debugEnabled(true);
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

    // Configuración de color
    app.config(['$mdThemingProvider', function ($mdThemingProvider) {
        var customPrimary = {
            '50': '#a3d7a5',
            '100': '#92cf94',
            '200': '#80c883',
            '300': '#6ec071',
            '400': '#5cb860',
            '500': '#4CAF50',
            '600': '#449d48',
            '700': '#3d8b40',
            '800': '#357a38',
            '900': '#2d682f',
            'A100': '#b5dfb7',
            'A200': '#c7e7c8',
            'A400': '#d9eeda',
            'A700': '#255627'
        };
        $mdThemingProvider.definePalette('customPrimary', customPrimary);

        var customAccent = {
            '50': '#d176e1',
            '100': '#ca61dc',
            '200': '#c34cd7',
            '300': '#bc37d3',
            '400': '#ae2cc5',
            '500': '#9C27B0',
            '600': '#89229b',
            '700': '#771e86',
            '800': '#641971',
            '900': '#52145c',
            'A100': '#d88be5',
            'A200': '#dfa0ea',
            'A400': '#e6b4ee',
            'A700': '#3f1048'
        };
        $mdThemingProvider.definePalette('customAccent', customAccent);

        var customWarn = {
            '50': '#fbb4af',
            '100': '#f99d97',
            '200': '#f8877f',
            '300': '#f77066',
            '400': '#f55a4e',
            '500': '#F44336',
            '600': '#f32c1e',
            '700': '#ea1c0d',
            '800': '#d2190b',
            '900': '#ba160a',
            'A100': '#fccbc7',
            'A200': '#fde1df',
            'A400': '#fff8f7',
            'A700': '#a21309'
        };
        $mdThemingProvider.definePalette('customWarn', customWarn);

        var customBackground = {
            '50': '#ffffff',
            '100': '#ffffff',
            '200': '#ffffff',
            '300': '#ffffff',
            '400': '#ffffff',
            '500': '#F5F5F5',
            '600': '#e8e8e8',
            '700': '#dbdbdb',
            '800': '#cfcfcf',
            '900': '#c2c2c2',
            'A100': '#ffffff',
            'A200': '#ffffff',
            'A400': '#ffffff',
            'A700': '#b5b5b5'
        };
        $mdThemingProvider.definePalette('customBackground', customBackground);

        $mdThemingProvider.theme('default')
            .primaryPalette('customPrimary', {
                'default': '500', // by default use shade 400 from the pink palette for primary intentions
                'hue-1': '600', // use shade 100 for the <code>md-hue-1</code> class
                'hue-2': '800', // use shade 600 for the <code>md-hue-2</code> class
                'hue-3': '50' // use shade A100 for the <code>md-hue-3</code> class
            })
            .accentPalette('customAccent', {
                'default': '500', // by default use shade 400 from the pink palette for primary intentions
                'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
            })
            .warnPalette('customWarn', {
                'default': '500', // by default use shade 400 from the pink palette for primary intentions
                'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
            })
            .backgroundPalette('customBackground', {
                'default': '500', // by default use shade 400 from the pink palette for primary intentions
                'hue-1': '600', // use shade 100 for the <code>md-hue-1</code> class
                'hue-2': '700', // use shade 600 for the <code>md-hue-2</code> class
                'hue-3': '900' // use shade A100 for the <code>md-hue-3</code> class
            })
    }]);
})();
