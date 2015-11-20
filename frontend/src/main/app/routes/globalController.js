(function () {
    'use strict';

    //Controlador principal de todo el sistema.
    angular.module('kafhe.controllers')
        .controller('GlobalController',
            ['$scope', '$rootScope', '$translate', '$location', '$cookies', 'CONFIG', 'ROUTES', 'growl', 'KGame',
                function ($scope, $rootScope, $translate, $location, $cookies, CONFIG, ROUTES, growl, KGame) {
                    // Objeto que almacena la información básica. Lo inicializo
                    $scope.global = {};
                    fnClearGlobalVars();

                    //Idioma seleccionado por el usuario
                    $scope.lang = $translate.use();

                    // Página actual
                    $scope.currentPage;

                    /************* MÉTODOS PÚBLICOS ******************/
                    $scope.clearGlobalVars = fnClearGlobalVars;
                    $scope.updateGameData = fnUpdateGameData;
                    $scope.updateUserObject = fnUpdateUserObject;
                    $scope.goToPage = fnGoToPage;
                    $scope.isCurrentPageHome = fnIsCurrentPageHome;
                    $scope.isCurrentPageBreakfast = fnIsCurrentPageBreakfast;
                    $scope.isCurrentPageForge = fnIsCurrentPageForge;
                    $scope.changeLang = fnChangeLang;
                    $scope.growlNotification = fnGrowlNotification;

                    /************* FUNCIONES *************/
                    /**
                     * Si ya está la variable global cargada, no la recargo de nuevo
                     * @param callback: Función a ejecutar cuando se termine la actualización
                     */
                    function fnUpdateGameData(callback) {
                        if (!$scope.global.loaded || !$scope.global.user || !$scope.global.gamedata.meals || !$scope.global.gamedata.drinks || !$scope.global.gamedata.skills) {
                            KGame.getGameData(function (user, meals, drinks, skills) {
                                // Actualizo las variables de información general
                                $scope.global.gamedata.meals = meals;
                                $scope.global.gamedata.drinks = drinks;
                                $scope.global.gamedata.skills = skills;
                                $scope.global.loaded = true;

                                // Ahora actualizo y proceso los datos del usuario
                                fnUpdateUserObject(user);

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
                    function fnUpdateUserObject(user) {
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
                        /*selector = ':has(:root > .source:val("' + CONFIG.constCommonSkills + '"))';
                         res = JSONSelect.match(selector, $scope.global.gamedata.skills);
                         if (res.length === 1) {
                         $scope.global.skills.push(res[0]);
                         }*/

                        // Ahora saco las habilidades de arma equipada
                        if ($scope.global.equipment.weapon && $scope.global.equipment.weapon !== '') {
                            $scope.global.equipment.weapon.skills.forEach(function (skill) {
                                $scope.global.skills.push(skill);
                            });

                            /*var conjunto = $scope.global.equipment.weapon.skills.map(_generateSelector);

                             selector = ':has(' + conjunto.join(',') + ')';
                             res = JSONSelect.match(selector, $scope.global.gamedata.skills);
                             if (res.length === 1) {

                             }*/
                        }

                        // Ahora saco las habilidades de armadura equipada
                        if ($scope.global.equipment.armor && $scope.global.equipment.armor !== '') {
                            $scope.global.equipment.armor.skills.forEach(function (skill) {
                                $scope.global.skills.push(skill);
                            });
                            /*var conjunto2 = $scope.global.equipment.armor.skills.map(_generateSelector);

                             selector = ':has(' + conjunto2.join(',') + ')';
                             res = JSONSelect.match(selector, $scope.global.gamedata.skills);
                             if (res.length === 1) {
                             $scope.global.skills.push(res[0]);
                             }*/
                        }

                        // Función para generar cadenas de selectores de este tipo
                        //function _generateSelector(identifier) {
                        //    return ':root > .id:val("' + identifier + '")';
                        //}

                        // El inventario del jugador
                        $scope.global.inventory = user.game.inventory;
                    }

                    /**
                     * Función para cambiar de página
                     * @param route Ruta destino
                     */
                    function fnGoToPage(route) {
                        $scope.currentPage = route;
                        $location.path('/' + route);
                    }

                    /**
                     * Comprueba si estoy en la home
                     */
                    function fnIsCurrentPageHome() {
                        return ($location.path() === null || $location.path() === ROUTES.home);
                    }

                    /**
                     * Comprueba si estoy en la página de desayunos
                     */
                    function fnIsCurrentPageBreakfast() {
                        return ($location.path() === ROUTES.breakfast);
                    }

                    /**
                     * Comprueba si estoy en la página de forja
                     */
                    function fnIsCurrentPageForge() {
                        return ($location.path() === ROUTES.forge);
                    }

                    /**
                     * Función de cambio de idioma
                     * @param lang Idioma destino. Si no es uno de los aceptados no se cambia el idioma
                     */
                    function fnChangeLang(lang) {
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
                    function fnGrowlNotification(type, msg, title) {
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
                    function fnClearGlobalVars() {
                        $scope.global = {
                            user: {},
                            gamedata: {
                                meals: {},
                                drinks: {},
                                skills: {}
                            },
                            skills: [],
                            equipment: {},
                            inventory: {},
                            navigation: {},
                            loaded: false
                        };
                    }
                }]);
})();
