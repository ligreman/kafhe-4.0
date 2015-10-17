(function () {
    'use strict';

    //Configuración de las rutas
    angular.module('kafhe').config(['$routeProvider', 'ROUTES',
        function ($routeProvider, ROUTES) {
            $routeProvider.
                // Login
                when('/', {
                    templateUrl: 'app/routes/login/loginView.html',
                    controller: 'LoginController'
                }).
                when(ROUTES.loginValidation, {
                    //Página de paso en el proceso de login. No requiero que esté logueado aún
                    //Lo que hace es redirigir a la home, de forma transparente al usuario
                    redirectTo: ROUTES.home
                }).

                when(ROUTES.home, {
                    templateUrl: 'views/search.html',
                    controller: 'SearchCtrl',
                    //Variables adicionales de esta ruta
                    access: {
                        //Requiere login para acceder
                        loginRequired: true
                    }
                }).

                otherwise({
                    //Página por defecto
                    redirectTo: '/'
                });
        }]);
})();