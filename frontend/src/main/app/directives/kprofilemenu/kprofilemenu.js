(function () {
    'use strict';

    var app = angular.module('kafhe.directives');

    app.directive('kProfileMenu', function () {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/directives/kprofilemenu/kprofilemenu.html'
        };
    });
})();
