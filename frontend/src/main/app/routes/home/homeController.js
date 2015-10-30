(function () {
    'use strict';

    //Controlador de la pantalla de login
    angular.module('kafhe.controllers')
        .controller('HomeController',
        ['$scope',
            function ($scope) {
                // Actualizamos los datos si hace falta
                console.log("Home controller");
                $scope.updateGameData();
            }]);
})();
