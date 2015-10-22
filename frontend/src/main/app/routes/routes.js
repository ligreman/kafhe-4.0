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
                    templateUrl: 'app/routes/home/homeView.html',
                    controller: 'HomeController',
                    //Variables adicionales de esta ruta
                    access: {
                        //Requiere login para acceder
                        loginRequired: true
                    }
                }).

                when(ROUTES.error, {
                    templateUrl: 'app/routes/error/errorView.html',
                    controller: 'ErrorController'
                }).

                otherwise({
                    //Página por defecto
                    redirectTo: '/'
                });
        }]);
})();
