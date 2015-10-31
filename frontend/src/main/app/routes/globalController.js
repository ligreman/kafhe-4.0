(function () {
    'use strict';

    //Controlador principal de todo el sistema.
    angular.module('kafhe.controllers')
        .controller('GlobalController',
        ['$scope', '$rootScope', '$translate', '$location', '$cookies', 'CONFIG', 'growl', 'KGame',
            function ($scope, $rootScope, $translate, $location, $cookies, CONFIG, growl, KGame) {
                // Objeto que almacena la información básica. Lo inicializo
                $scope.global = {};
                clearGlobalVars();

                //Idioma seleccionado por el usuario
                $scope.lang = $translate.use();

                /************* MÉTODOS PÚBLICOS ******************/
                $scope.clearGlobalVars = clearGlobalVars;
                $scope.updateGameData = updateGameData;
                $scope.updateUserObject = updateUserObject;
                $scope.goToPage = goToPage;
                $scope.changeLang = changeLang;
                $scope.growlNotification = growlNotification;

                /************* FUNCIONES *************/
                /**
                 * Si ya está la variable global cargada, no la recargo de nuevo
                 * @param callback: Función a ejecutar cuando se termine la actualización
                 */
                function updateGameData(callback) {
                    if (!$scope.global.loaded || !$scope.global.user || !$scope.global.gamedata.meals || !$scope.global.gamedata.drinks || !$scope.global.gamedata.skills) {
                        KGame.getGameData(function (user, meals, drinks, skills) {
                            // Actualizo las variables de información general
                            $scope.global.gamedata.meals = meals;
                            $scope.global.gamedata.drinks = drinks;
                            $scope.global.gamedata.skills = skills;
                            $scope.global.loaded = true;

                            // Ahora actualizo y proceso los datos del usuario
                            updateUserObject(user);

                            if (typeof callback === 'function') {
                                callback();
                            }
                        });
                    } else {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }
                }

                /**
                 * Actualiza el objeto usuario (user) dentro de la variable global. Realiza además:
                 * 1. Saca el arma y armadura equipadas
                 * 2. Recoge las habilidades disponibles
                 */
                function updateUserObject(user) {
                    $scope.global.user = user;

                    // Saco el arma equipado
                    var selector = ':has(:root > .id:val("' + user.game.equipment.weapon + '"))';
                    var res = JSONSelect.match(selector, user.game.inventory.weapons);
                    if (res.length === 1) {
                        $scope.global.equipment.weapon = res[0];
                    }

                    // Saco la armadura equipada
                    selector = ':has(:root > .id:val("' + user.game.equipment.armor + '"))';
                    res = JSONSelect.match(selector, user.game.inventory.armors);
                    if (res.length === 1) {
                        $scope.global.equipment.armor = res[0];
                    }

                    // Saco las habilidades que puedo ejecutar, primero las comunes
                    selector = ':has(:root > .source:val("' + CONFIG.constCommonSkills + '"))';
                    res = JSONSelect.match(selector, $scope.global.gamedata.skills);
                    if (res.length === 1) {
                        $scope.global.skills.push(res[0]);
                    }

                    // Ahora saco las habilidades de arma equipada
                    if ($scope.global.equipment.weapon && $scope.global.equipment.weapon !== '') {
                        var conjunto = $scope.global.equipment.weapon.skills.map(_generateSelector);

                        selector = ':has(' + conjunto.join(',') + ')';
                        res = JSONSelect.match(selector, $scope.global.gamedata.skills);
                        if (res.length === 1) {
                            $scope.global.skills.push(res[0]);
                        }
                    }

                    // Ahora saco las habilidades de armadura equipada
                    if ($scope.global.equipment.armor && $scope.global.equipment.armor !== '') {
                        var conjunto = $scope.global.equipment.armor.skills.map(_generateSelector);

                        selector = ':has(' + conjunto.join(',') + ')';
                        res = JSONSelect.match(selector, $scope.global.gamedata.skills);
                        if (res.length === 1) {
                            $scope.global.skills.push(res[0]);
                        }
                    }

                    // Función para generar cadenas de selectores de este tipo
                    function _generateSelector(identifier) {
                        return ':root > .id:val("' + identifier + '")';
                    }
                }

                /**
                 * Función para cambiar de página
                 * @param route Ruta destino
                 */
                function goToPage(route) {
                    $location.path('/' + route);
                }


                /**
                 * Función de cambio de idioma
                 * @param lang Idioma destino. Si no es uno de los aceptados no se cambia el idioma
                 */
                function changeLang(lang) {
                    if (lang === CONFIG.languages.english || lang === CONFIG.languages.spanish) {
                        $translate.use(lang);
                        $scope.lang = lang;
                    }
                }

                /**
                 * Muestra un growl con el mensaje que se quiera
                 * @param type Tipo de mensaje: warn, info, success, danger
                 * @param msg Mensaje.
                 * @param title
                 */
                function growlNotification(type, msg, title) {
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
                }

                /**
                 * Limpia las variables globales
                 */
                function clearGlobalVars() {
                    $scope.global = {
                        user: {},
                        gamedata: {
                            meals: {},
                            drinks: {},
                            skills: {}
                        },
                        skills: [],
                        equipment: {},
                        navigation: {},
                        loaded: false
                    };
                }
            }]);
})();
