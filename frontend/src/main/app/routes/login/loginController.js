(function () {
    'use strict';

    //Controlador de la pantalla de login
    angular.module('kafhe.controllers')
        .controller('LoginController',
        ['$scope', '$location', '$cookies', 'APISession', 'KSession',
            function ($scope, $location, $cookies, APISession, KSession) {
                $scope.error = '';

                // función a la que se llama al pulsar el botón del formulario del login
                $scope.login = function () {

                    // pasa como parámetros el usuario y password recogidos del formulario de login
                    APISession.session(null)
                        .login($.param({
                            username: $scope.username,
                            password: $scope.password
                        }), function (response) {
                            //Proceso la respuesta del webservice
                            if (response === null || response.error !== '') {
                                // Hay un error por lo que lo muestro.
                                // No debería pasar ya que para esto están los interceptors
                                $scope.error = response.code;
                                //$scope.growl(CONFIG.dangerLevel, $scope.error);

                                //Hago logout
                                KSession.logout();
                            } else {
                                // Generamos la sesión con el token y expiración que me llegan
                                KSession.login(response.session.token, response.session.expire);

                                //Voy a la página de validación de login
                                $location.path(ROUTES.loginValidation);
                            }
                        });

                };
            }]);
})();