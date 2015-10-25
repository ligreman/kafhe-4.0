(function () {
    'use strict';

    // Controlador de la pantalla de login
    angular.module('kafhe.controllers')
        .controller('BreakfastController',
        ['$scope', '$mdDialog', 'API',
            function ($scope, $mdDialog, API) {
                $scope.selection = {
                    meal: '',
                    drink: '',
                    ito: false
                };

                // Actualizamos mis datos de partida en caso de que haga falta
                $scope.updateGameData(function () {
                    if ($scope.global.game.user.game.order && $scope.global.game.user.game.order.meal) {
                        $scope.selection.meal = $scope.global.game.user.game.order.meal._id;
                        $scope.selection.drink = $scope.global.game.user.game.order.drink._id;
                        $scope.selection.ito = $scope.global.game.user.game.order.ito;
                    }
                });

                // Envío el cambio de pedido
                $scope.btnMakeOrder = function (event) {
                    var confirm = $mdDialog.confirm()
                        .title('Would you like to delete your debt?')
                        .content('All of the banks have agreed to forgive you your debts.')
                        .ariaLabel('Lucky day')
                        .ok('OK')
                        .cancel('CANCEL')
                        .targetEvent(event);

                    $mdDialog.show(confirm).then(function () {
                        // He seleccionado cambiar el pedido
                        API.order()
                            .create({
                                meal: $scope.selection.meal,
                                drink: $scope.selection.drink,
                                ito: $scope.selection.ito
                            }, function (response) {
                                if (response) {
                                    // Me devuelve el objeto usuario actualizado
                                    $scope.updateUserObject(response.data.user);

                                    // Mensaje growl de OK
                                    $scope.growl('success', 'OK maroto');
                                }
                            });
                    }, function () {
                    });
                };

                // Envío la petición de eliminar el pedido
                $scope.btnRemoveOrder = function () {
                };

                // Lo del otro día
                $scope.btnLastDayOrder = function () {
                    if ($scope.global.game.user.game.last_order && $scope.global.game.user.game.last_order.meal) {
                        $scope.selection.meal = $scope.global.game.user.game.last_order.meal._id;
                        $scope.selection.drink = $scope.global.game.user.game.last_order.drink._id;
                        $scope.selection.ito = $scope.global.game.user.game.last_order.ito;
                    } else {
                        $scope.growl('warning', 'El otro día no tiene pedido');
                    }
                };

            }]);
})();
