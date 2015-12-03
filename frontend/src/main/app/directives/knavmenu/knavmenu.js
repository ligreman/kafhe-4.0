(function () {
    'use strict';

    var app = angular.module('kafhe.directives');

    app.directive('kNavMenu', function () {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/directives/knavmenu/knavmenu.html'
        };
    });
})();
