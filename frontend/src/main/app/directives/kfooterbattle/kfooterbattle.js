(function () {
    'use strict';

    var app = angular.module('kafhe.directives');

    app.directive('kFooterBattle', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'app/directives/kfooterbattle/kfooterbattle.html',
            controller: ['$scope', '$mdDialog', 'API',
                function ($scope, $mdDialog, API) {

                    $scope.showTargets = fnShowTargets;

                    /*********************************************************************/
                    /*********************** FUNCIONES ***********************************/
                    function fnShowTargets(skillId, $event) {
                        $event.preventDefault();
                        console.log(skillId);

                        // Pido la lista de objetivos al API
                        API.user()
                            .list({}, function (response) {
                                if (response) {
                                    showDialog(skillId, response.data.players, $event);
                                }
                            });
                    };

                    function showDialog(skillId, playerList, $event) {
                        $mdDialog.show({
                            locals: {
                                skillId: skillId,
                                playerList: playerList
                            },
                            controller: 'TargetSelect',
                            templateUrl: 'app/components/dialogs/targetSelect/target-select.html',
                            scope: $scope,
                            preserveScope: true,
                            clickOutsideToClose: true,
                            escapeToClose: true,
                            targetEvent: $event
                        }).then(function (result) {
                            // Respuesta OK. Podría pasar un parámetro answer
                            console.log("aceptao " + result);
                        }, function (reason) {
                            // Ha respondido cancelar
                            console.log("cancelao " + reason);
                        });
                    }
                }]
        };
    });
})();
