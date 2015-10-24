(function () {
    'use strict';

    //Controlador de la pantalla de login
    angular.module('kafhe.controllers')
        .controller('BreakfastController',
        ['$scope',
            function ($scope) {
                // Actualizamos los datos si hace falta
                $scope.updateGameData();
            }]);
})();
