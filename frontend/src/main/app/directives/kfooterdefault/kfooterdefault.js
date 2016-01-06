(function () {
    'use strict';

    var app = angular.module('kafhe.directives');

    app.directive('kFooterDefault', function () {
        var controlador = ['$scope', function ($scope) {
        }];

        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/directives/kfooterdefault/kfooterdefault.html',
            scope: true,
            controller: controlador
        };
    });
})();
