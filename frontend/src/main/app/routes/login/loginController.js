(function () {
    'use strict';

    //Controlador de la pantalla de login
    angular.module('kafhe.controllers')
        .controller('LoginController',
        ['$scope', 'API',
            function ($scope, API) {
                $scope.login = {
                    username: '',
                    password: ''
                };
                $scope.growl('info', "titleSearchesHistory");
                $scope.growl('success', "textAreaIpSearch", "textAreaIpSearch");
                $scope.growl('warning', "textAreaDomainSearch", "textAreaIpSearch");
                $scope.growl('error', "textAreaHashSearch", "textAreaIpSearch");

                // función a la que se llama al pulsar el botón del formulario del login
                $scope.btnLogin = function () {
                    console.log($scope.login);

                    // pasa como parámetros el usuario y password recogidos del formulario de login
                    API.session(null)
                        .login($scope.login, function (response) {
                            //Proceso la respuesta del webservice
                            if (response === null || !response.login) {
                                // Hay un error por lo que lo muestro.
                                // No debería pasar ya que para esto están los interceptors
                                //$scope.error = response.code;
                                //$scope.growl(CONFIG.dangerLevel, $scope.error);
                                console.log("error");
                                console.log(response);
                                //Hago logout
                                //KSession.logout();
                            } else {
                                // Generamos la sesión con el token y expiración que me llegan
                                //KSession.login(response.session.token, response.session.expire);
                                console.log("OK");
                                console.log(response);
                                //Voy a la página de validación de login
                                $location.path(ROUTES.loginValidation);
                            }
                        });

                };
            }]);
})();
