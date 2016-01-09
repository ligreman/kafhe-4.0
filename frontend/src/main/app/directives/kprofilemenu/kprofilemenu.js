(function () {
    'use strict';

    var app = angular.module('kafhe.directives');

    app.directive('kProfileMenu', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'app/directives/kprofilemenu/kprofilemenu.html',
            controller: ['$scope', 'API', '$mdDialog', function ($scope, API, $mdDialog) {

                $scope.logout = fnLogout;
                $scope.destroy = fnDestroy;
                $scope.leaderPanel = fnLeaderPanel;

                /*********************************************************************/
                /*********************** FUNCIONES ***********************************/
                function fnLeaderPanel($event) {
                    $mdDialog.show({
                        locals: {},
                        controller: 'LeaderPanel',
                        templateUrl: 'app/components/dialogs/leaderPanel/leader-panel.html',
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

                /**
                 * Destruye este objeto de equipo
                 */
                function fnDestroy(objeto) {
                    API.equipment()
                        .destroy({
                                inventory_id: objeto.id
                            },
                            function (response) {
                                // Actualizo el objeto usuario
                                $scope.updateUserObject(response.data.user);

                                // Growl
                                $scope.growlNotification('success', 'rompido', 'rompidoTitle');
                            });
                }

                /**
                 * Hace logout de la aplicación
                 */
                function fnLogout() {
                    API.session()
                        .logout({},
                            function (response) {
                                if (response) {
                                }
                            });
                }
            }]
        };
    });
})();
