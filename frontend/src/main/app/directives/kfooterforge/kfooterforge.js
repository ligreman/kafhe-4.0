(function () {
    'use strict';

    var app = angular.module('kafhe.directives');

    app.directive('kFooterForge', function () {
        var controlador = ['$scope', 'API', function ($scope, API) {
            $scope.equip = fnEquip;

            function fnEquip(objeto) {
                API.equipment()
                    .equip({
                            inventory_id: objeto.id
                        },
                        function (response) {
                            // Actualizo el objeto usuario
                            $scope.updateUserObject(response.data.user);

                            // Growl
                            $scope.growlNotification('success', 'equipado', 'equipadoTitle');
                        });
            }
        }];

        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/directives/kfooterforge/kfooterforge.html',
            scope: true,
            controller: controlador
        };
    });
})();
