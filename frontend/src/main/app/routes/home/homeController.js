(function () {
    'use strict';

    //Controlador de la pantalla de login
    angular.module('kafhe.controllers')
        .controller('HomeController',
            ['$scope',
                function ($scope) {
                    // Actualizamos los datos si hace falta
                    $scope.updateGameData(fnAfterUpdate);

                    // Funciones
                    $scope.iconize = fnIconize;

                    /**
                     * Una vez he terminado de actualizar los datos
                     */
                    function fnAfterUpdate() {
                    }

                    /**
                     * Genera un nombre de icono para el tipo que se le pase
                     */
                    function fnIconize(tipo) {
                        var icon = '';
                        switch (tipo) {
                            case 'skill':
                                icon = 'flash_on';
                                break;
                            case 'breakfast':
                                icon = 'local_dining';
                                break;
                            case 'forge':
                                icon = 'gavel';
                                break;
                            case 'furnace':
                                icon = 'whatshot';
                                break;
                            case 'fury':
                                icon = 'remove_red_eye';
                                break;
                            case 'equipment':
                                icon = 'security';
                                break;
                            case 'system':
                            default:
                                icon = 'info_outline';
                        }
                        return icon;
                    }
                }]);
})();
