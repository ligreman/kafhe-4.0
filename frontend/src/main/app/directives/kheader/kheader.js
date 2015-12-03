(function () {
    'use strict';

    var app = angular.module('kafhe.directives');

    app.directive('kHeader', ['$mdSticky', function ($mdSticky) {
        return {
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'app/directives/kheader/kheader.html',
            controller: ['$scope', 'API', function ($scope, API) {

                // Llamo al API para resetear la base de datos
                $scope.resetBBDD = function () {
                    API.dev()
                        .resetmongo({}, function (response) {
                            if (response) {
                                // Mensaje growl de OK
                                $scope.growlNotification('success', 'OK');
                            }
                        });
                };

                // Llamo al API para cambiar el estado de la partida
                $scope.gameStatus = function (estado) {
                    API.dev()
                        .gamestatus({
                            status: estado
                        }, function (response) {
                            if (response) {
                                // Mensaje growl de OK
                                $scope.growlNotification('success', 'OK');
                            }
                        });
                };

                $scope.logout = function () {
                    API.session()
                        .logout({},
                            function (response) {
                                if (response) {
                                    // Mensaje growl de OK
                                    $scope.growlNotification('success', 'Hasta luego');
                                }
                            });
                };

            }]
        };
    }]);
})();
