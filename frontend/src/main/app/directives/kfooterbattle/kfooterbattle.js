(function () {
    'use strict';

    var app = angular.module('kafhe.directives');

    app.directive('kFooterBattle', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'app/directives/kfooterbattle/kfooterbattle.html',
            controller: ['$scope', '$mdDialog', function ($scope, $mdDialog) {

                $scope.showTargets = fnShowTargets;

                /**
                 * Crea un cuadro de diálogo
                 */
                function fnShowTargets(skillId, $event) {
                    $event.preventDefault();
                    console.log(skillId);

                    $mdDialog.show({
                        locals: {
                            skillId: skillId
                        },
                        controller: 'TargetSelect',
                        templateUrl: 'app/components/dialogs/targetSelect/target-select.html',
                        scope: $scope,
                        preserveScope: true,
                        clickOutsideToClose: false,
                        escapeToClose: false
                    }).then(function () {
                        // Respuesta OK. Podría pasar un parámetro answer
                    }, function () {
                        // Ha respondido cancelar
                    });
                };

                /**
                 * Función que muestra u oculta el overlay
                 * @param accepted Booleano que indica si se quiere mostrar u ocultar
                 */
                function fnInteractionDialog(accepted) {
                    // Si he aceptado o cancelado el cuadro de diálogo
                    if (accepted) {
                        $mdDialog.hide();
                    } else {
                        $mdDialog.cancel();
                    }
                }
            }]
        };
    });
})();
