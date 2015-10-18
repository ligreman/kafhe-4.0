(function () {
    'use strict';

    //Controlador principal de todo el sistema.
    angular.module('kafhe.controllers')
        .controller('GlobalController',
        ['$scope', '$rootScope', '$translate', '$location', '$cookies', 'CONFIG', 'growl',
            function ($scope, $rootScope, $translate, $location, $cookies, CONFIG, growl) {
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
                 * @param type Tipo de mensaje: warn, info, success, danger
                 * @param msg Mensaje.
                 */
                $scope.growl = function (type, msg, title) {
                    //Traduzco el mensaje del toast de forma asíncrona
                    var translation = $translate.instant(msg),
                        transTitle = '';

                    if (title) {
                        transTitle = $translate.instant(title);
                    }

                    switch (type) {
                        case 'warning':
                            growl.warning(translation, {title: transTitle});
                            break;
                        case 'error':
                            growl.error(translation, {title: transTitle});
                            break;
                        case 'success':
                            growl.success(translation, {title: transTitle});
                            break;
                        case 'info':
                        default:
                            growl.info(translation, {title: transTitle});
                    }
                };

            }]);
})();