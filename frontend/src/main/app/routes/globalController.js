(function () {
    'use strict';

    //Controlador principal de todo el sistema.
    angular.module('kafhe.controllers')
        .controller('GlobalController',
        ['$scope', '$rootScope', '$translate', '$location', '$cookies', 'CONFIG',
            function ($scope, $rootScope, $translate, $location, $cookies, CONFIG) {
                /**
                 * Función para cambiar de página
                 * @param route Ruta destino
                 */
                $scope.goToPage = function (route) {
                    $location.path('/' + route);
                };

                //Idioma seleccionado por el usuario
                $scope.lang = $translate.use();
                /**
                 * Función de cambio de idioma
                 * @param lang Idioma destino. Si no es uno de los aceptados no se cambia el idioma
                 */
                $scope.changeLang = function (lang) {
                    if (lang === CONFIG.languages.english || lang === CONFIG.languages.spanish) {
                        $translate.use(lang);
                        $scope.lang = lang;
                    }
                };

                /**
                 * Muestra un growl con el mensaje que se quiera
                 * @param type Tipo de mensaje
                 * @param msg Mensaje.
                 */
                $scope.growl = function (type, msg) {
                    //Traduzco el mensaje del toast de forma asíncrona
                    $translate(msg).then(function (translation) {
                        /*ngToast.create({
                         className: type,
                         content: translation
                         });*/
                    });
                };

            }]);
})();