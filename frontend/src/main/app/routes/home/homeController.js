(function () {
    'use strict';

    //Controlador de la pantalla de login
    angular.module('kafhe.controllers')
        .controller('HomeController',
        ['$scope', 'API',
            function ($scope, API) {


                /*************** CARGA DE DATOS INICIAL ************************/

                    // Pido al webservice los datos del usuario y partida actual
                API.user().me({}, function (response) {
                    // Obtengo el usuario de la respuesta
                    $scope.game.user = response.data.user;

                    //TODO aquí podría extraer o procesar un poco los datos del usuario para sacar su pedido, el del día anterior, etc... si merece la pena
                });

                // Pido también los pedidos (meal and drink)
                API.order().mealanddrink({}, function (response) {
                    // Obtengo el usuario de la respuesta
                    $scope.game.meals = response.data.meals;
                    $scope.game.drinks = response.data.drinks;
                });

                // Pido los datos de habilidades
                API.skill().list({}, function (response) {
                    // Obtengo el usuario de la respuesta
                    $scope.game.skills = response.data.skills;
                });
            }]);
})();
