(function () {
    'use strict';

    var app = angular.module('kafhe.directives');

    app.directive('kFooterBreakfast', function () {
        var controlador = ['$scope', function ($scope) {
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
