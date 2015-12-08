(function () {
    'use strict';

    var app = angular.module('kafhe.directives');

    app.directive('kFooterForge', function () {
        var controlador = ['$scope', function ($scope) {
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
