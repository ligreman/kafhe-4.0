'use strict';

var app = angular.module('kafhe.directives');

app.directive('kFooter', function () {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'app/directives/kfooter/kfooter.html'
    };
});
