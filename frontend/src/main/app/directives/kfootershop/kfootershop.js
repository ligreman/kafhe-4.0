(function () {
    'use strict';

    var app = angular.module('kafhe.directives');

    app.directive('kFooterShop', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'app/directives/kfootershop/kfootershop.html',
            controller: ['$scope', '$mdDialog', 'API',
                function ($scope, $mdDialog, API) {

                }],
            // Manipulamos el DOM
            link: function (scope, element, attrs) {

            }
        };
    });
})();
