(function () {
    'use strict';

    var app = angular.module('kafhe.directives');

    app.directive('kFooterBreakfast', function () {
        var controlador = ['$scope', 'API', function ($scope, API) {
            // Saco los jugadores que ya metieron el desayuno
            API.order()
                .status(function (response) {
                    if (response) {
                        $scope.playersBreakfast = response.data.players;
                    }
                });
        }];

        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/directives/kfooterbreakfast/kfooterbreakfast.html',
            scope: true,
            controller: controlador
        };
    });
})();
