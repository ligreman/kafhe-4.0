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
                            // Ha seleccionado a los objetivos así que llamo al API para ejecutar la skill
                            API.skill()
                                .execute({
                                    skill_id: skillId,
                                    targets: result.targets
                                }, function (response) {
                                    if (response && response.data && response.data.user) {
                                        // Actualizo el objeto local del usuario con lo que me devuelve el servidor
                                        $scope.updateUserObject(response.data.user);
                                    }
                                });
                        }, function (reason) {
                            // Ha respondido cancelar
                            console.log("cancelao ");
                        });
                    }
                }]
        };
    });
})();
