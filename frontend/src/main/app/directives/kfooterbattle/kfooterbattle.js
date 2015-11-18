'use strict';

var app = angular.module('kafhe.directives');

app.directive('kFooterBattle', function () {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'app/directives/kfooterbattle/kfooterbattle.html'
    };
});
