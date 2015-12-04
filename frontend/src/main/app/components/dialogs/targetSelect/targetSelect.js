(function () {
    'use strict';

    angular.module('kafhe.controllers')
        .controller('TargetSelect',
            ['$scope', '$rootScope', '$translate', '$mdDialog', 'skillId', 'playerList',
                function ($scope, $rootScope, $translate, $mdDialog, skillId, playerList) {
                    $scope.skillId = skillId;
                    $scope.playerList = playerList;
                    console.log(playerList);
                    /*********************************************************************/
                    /*********************** FUNCIONES ***********************************/

                    $scope.accept = function accept() {
                        $mdDialog.hide("pozi acepto");
                    };

                    $scope.cancel = function cancel() {
                        $mdDialog.cancel("pozi cancelo");
                    };

                    $scope.filterTargets = function (player) {
                        var retorno = true;

                        // Si soy yo no lo muestro
                        if (player.username === $rootScope.kUserLogged) {
                            retorno = false;
                        }

                        // Si está afk no lo muestro
                        if (player.game.afk) {
                            retorno = false;
                        }

                        return retorno;
                    };
                }
            ]);
})();
