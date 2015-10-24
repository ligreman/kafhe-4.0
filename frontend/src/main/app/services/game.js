(function () {
    'use strict';

    //Defino el módulo para importarlo como dependencia donde se requiera
    var authModule = angular.module('kafhe.services');

    //Defino el servicio concreto del Game
    authModule.factory('KGame',
        ['$rootScope', '$cookies', '$location', '$translate', 'API', '$q',
            function ($rootScope, $cookies, $location, $translate, API, $q) {
                /**
                 */
                var getGameData = function (callback) {
                    // Saco los datos de llamadas al api
                    return $q.all([API.user().me({}).$promise, API.order().mealanddrink({}).$promise, API.skill().list({}).$promise])
                        .then(function (results) {
                            callback(results[0].data.user, results[1].data.meals, results[1].data.drinks, results[2].data.skills);
                        });
                    /*
                     // Pido al webservice los datos del usuario y partida actual
                     API.user().me({}, function (response) {
                     // Obtengo el usuario de la respuesta
                     $scope.global.game.user = response.data.user;
                     console.log($scope.global.game.user);

                     //TODO aquí podría extraer o procesar un poco los datos del usuario para sacar su pedido, el del día anterior, etc... si merece la pena
                     });

                     // Pido también los pedidos (meal and drink)
                     API.order().mealanddrink({}, function (response) {
                     // Obtengo el usuario de la respuesta
                     $scope.global.game.meals = response.data.meals;
                     $scope.global.game.drinks = response.data.drinks;
                     });

                     // Pido los datos de habilidades
                     API.skill().list({}, function (response) {
                     // Obtengo el usuario de la respuesta
                     $scope.global.game.skills = response.data.skills;
                     });*/

                    /*Q.fcall(
                     function () {
                     return username;
                     })
                     .then(sessionUtils.deleteSessions)
                     .then(sessionUtils.createSession)
                     .done(function (access_token) {
                     console.log('Devuelvo el token de acceso: ' + access_token);

                     //Hago un return que resuelve el return general al ser el último
                     return done(null, user, {"access_token": access_token});
                     }, function (error) {
                     // We get here if any fails
                     console.error('Error creando la sesion del usuario: ' + error);
                     return done(null, false);
                     });*/
                };

                //Expongo los métodos del servicio
                return {
                    getGameData: getGameData
                };
            }
        ]);
})();
