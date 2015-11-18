(function () {
    'use strict';

    // Controlador de la pantalla de login
    angular.module('kafhe.controllers').controller('ForgeController',
        ['$scope', '$mdDialog', '$translate', 'API',
            function ($scope, $mdDialog, $translate, API) {
                // Actualizamos los datos si hace falta
                $scope.updateGameData(afterUpdate);

                function afterUpdate() {
                }

            }]);
})();
