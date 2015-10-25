(function () {
    'use strict';

    //Defino el módulo para importarlo como dependencia donde se requiera
    var authModule = angular.module('kafhe.services');

    //Defino el servicio concreto del Game
    authModule.factory('KGame',
        ['$rootScope', '$cookies', '$location', '$translate', 'API', '$q',
            function ($rootScope, $cookies, $location, $translate, API, $q) {
                /**
                 * Pide al webservice los datos de la partida y la información de pedidos y habilidades
                 * @param callback Función callback. Se le pasa la info de: user, meals, drinks, skills
                 * @returns {*}
                 */
                var getGameData = function (callback) {
                    // Saco los datos de llamadas al api
                    return $q.all([
                        API.user().me({}).$promise,
                        API.order().mealanddrink({}).$promise,
                        API.skill().list({}).$promise
                    ]).then(function (results) {
                        callback(
                            results[0].data.user,
                            results[1].data.meals,
                            results[1].data.drinks,
                            results[2].data.skills
                        );
                    });
                };

                //Expongo los métodos del servicio
                return {
                    getGameData: getGameData
                };
            }
        ]);
})();
