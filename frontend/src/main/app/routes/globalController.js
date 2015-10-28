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

                // Métodos públicos
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
                    if (!$scope.global.loaded || !$scope.global.user || !$scope.global.meals || !$scope.global.drinks || !$scope.global.skills) {
                        console.log("ACTUALIZO");
                        KGame.getGameData(function (user, meals, drinks, skills) {
                            // Actualizo las variables de información general
                            $scope.global.meals = meals;
                            $scope.global.drinks = drinks;
                            $scope.global.skills = skills;
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
                 * Actualiza el objeto usuario (user) dentro de la variable global
                 */
                function updateUserObject(user) {
                    $scope.global.user = user;

                    var armaduras = user.game.inventory.armors,
                        armas = user.game.inventory.weapons,
                        armaduraEquipada = user.game.equipment.armor,
                        armaEquipada = user.game.equipment.weapon;

                    // Saco el arma equipada
                    for (var armaId in armas) {
                        if (armas.hasOwnProperty(armaId)) {
                            var arma = armas[armaId];

                            if (arma.id == armaEquipada) {
                                $scope.global.equipment.weapon = arma;
                            }
                        }
                    }

                    // Saco la armadura equipada
                    for (var armaduraId in armaduras) {
                        if (armaduras.hasOwnProperty(armaduraId)) {
                            var armadura = armaduras[armaduraId];

                            if (armadura.id == armaduraEquipada) {
                                $scope.global.equipment.armor = armadura;
                            }
                        }
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
                        meals: {},
                        drinks: {},
                        skills: {},
                        equipment: {},
                        navigation: {},
                        loaded: false,
                        loggedIn: false
                    };
                }

            }]);
})();
