'use strict';

var app = angular.module('kafhe.directives');

app.directive('kHeader', ['$mdSticky', function ($mdSticky) {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'app/directives/kheader/kheader.html',
        link: function (scope, element) {
            //$mdSticky(scope, element, element.find('p'));
        }
    };
}]);
