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

                    // Librería Math de javascript
                    $scope.Math = window.Math;

                    // Página actual
                    $scope.currentPage;
                    // Muestro o no el menú profile
                    $scope.showProfileMenu = false;

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
                    $scope.toggleProfileMenu = fnToggleProfile;

                    /************* FUNCIONES *************/
                    /**
                     * Actualiza las variables de información estática de la partida.
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

                        // Limpio las skills para generar el array de nuevo
                        $scope.global.skills = [];
                        // Ahora saco las habilidades de arma equipada
                        if ($scope.global.equipment.weapon && $scope.global.equipment.weapon !== '') {
                            $scope.global.equipment.weapon.skills.forEach(function (skill) {
                                $scope.global.skills.push(skill);
                            });
                        }

                        // Ahora saco las habilidades de armadura equipada
                        if ($scope.global.equipment.armor && $scope.global.equipment.armor !== '') {
                            $scope.global.equipment.armor.skills.forEach(function (skill) {
                                $scope.global.skills.push(skill);
                            });
                        }

                        // El inventario del jugador
                        $scope.global.inventory = user.game.inventory;

                        // Variables para pintar en el front
                        // Reputación
                        $scope.global.print.toastPoints = $scope.Math.floor(user.game.stats.reputation / CONFIG.constReputationToToastProportion);
                        var cantidad = user.game.stats.reputation % CONFIG.constReputationToToastProportion;
                        // Lo paso de (0 a config) a un valor 0-100%
                        var proporcion = cantidad * 100 / CONFIG.constReputationToToastProportion;
                        // Ahora, como mis grados van de 0 a 90, hago la regla de tres
                        proporcion = proporcion * 90 / 100;
                        // Para mí 90º es lo más bajo, por lo que tengo que invertirlo
                        var degrees = $scope.Math.round(90 - proporcion);
                        $scope.global.print.reputationDegreeStyle = {"transform": "rotate(" + degrees + "deg)"};
                        // Vida
                        $scope.global.print.lifeBarStyle = {"width": user.game.stats.life + "%"};
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
                                meals: [],
                                drinks: [],
                                skills: []
                            },
                            print: {},
                            skills: [],
                            equipment: {},
                            inventory: {},
                            navigation: {},
                            loaded: false
                        };
                    }

                    /**
                     * Abre o cierra el menú lateral
                     */
                    function fnToggleProfile() {
                        $scope.showProfileMenu = !$scope.showProfileMenu;
                    }

                }]);
})();
