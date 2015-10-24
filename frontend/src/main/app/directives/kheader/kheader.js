'use strict';

var app = angular.module('kafhe.directives');

app.directive('kHeader', function () {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'app/directives/kheader/kheader.html'
    };
});
