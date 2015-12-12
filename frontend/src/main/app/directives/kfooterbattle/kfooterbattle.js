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
                    /**
                     * Lanza el proceso de mostrar la ventana de selección de objetivos
                     * @param skillId
                     * @param $event
                     */
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
                    }

                    /**
                     * Muestra el cuadro de diálogo
                     */
                    function showDialog(skill, playerList, $event) {
                        $mdDialog.show({
                            locals: {
                                skill: skill,
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
                                    skill_id: skill.id,
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
                }],
            // Manipulamos el DOM
            link: function (scope, element, attrs) {
                $(element).find('#skill-bar').mCustomScrollbar({
                    axis: "x",
                    scrollInertia: 300,
                    autoHideScrollbar: false,
                    mouseWheel: {
                        axis: "x"
                    },
                    scrollButtons: {
                        enable: true
                    },
                    theme: "dark-thin"
                });
            }
        };
    });
})();
