(function () {
    'use strict';

    // Controlador de la pantalla de login
    angular.module('kafhe.controllers').controller('ForgeController',
        ['$scope', '$mdDialog', '$translate', 'API', 'growl',
            function ($scope, $mdDialog, $translate, API, growl) {
                $scope.furnace = {};
                $scope.forge = {};
                $scope.selectors = {
                    weapon: ['bladed', 'blunt', 'piercing'],
                    armor: ['light', 'medium', 'heavy']
                };

                // Métodos públicos
                $scope.btnFurnaceTostem = fnFurnaceTostem;
                $scope.btnFurnaceRune = fnFurnaceRune;
                $scope.btnForgeWeapon = fnForgeWeapon;
                $scope.btnForgeArmor = fnForgeArmor;

                // Actualizamos los datos si hace falta
                $scope.updateGameData(fnAfterUpdate);
                cleanForm();


                /****** FUNCIONES ********/

                /**
                 *
                 */
                function fnFurnaceTostem() {
                    // Compruebo que los dos tostem están informados y no son el mismo
                    if (!$scope.furnace.tostem.tostemA || !$scope.furnace.tostem.tostemB || ($scope.furnace.tostem.tostemA === $scope.furnace.tostem.tostemB)) {
                        growl.error($translate.instant('errFurnaceNoValidTostems'));
                        return;
                    }

                    // Llamo al API enviando los tostems a hornear
                    API.furnace()
                        .tostem({
                            inventory_a: $scope.furnace.tostem.tostemA,
                            inventory_b: $scope.furnace.tostem.tostemB
                        }, function (response) {
                            if (response) {
                                // Me devuelve el objeto usuario actualizado
                                $scope.updateUserObject(response.data.user);

                                var tostemCreated = response.data.result;
                                console.log(tostemCreated);

                                // Mensaje growl de OK
                                $scope.growlNotification('success', $translate.instant('okFurnaceTostems'));
                                cleanForm();
                            }
                        });
                }

                /**
                 *
                 */
                function fnFurnaceRune() {
                    // Compruebo que las dos runas están informados y no son la misma
                    if (!$scope.furnace.rune.runeA || !$scope.furnace.rune.runeB || ($scope.furnace.rune.runeA === $scope.furnace.rune.runeB)) {
                        growl.error($translate.instant('errFurnaceNoValidRunes'));
                        return;
                    }

                    // Llamo al API enviando las runas a hornear
                    API.furnace()
                        .rune({
                            inventory_a: $scope.furnace.rune.runeA,
                            inventory_b: $scope.furnace.rune.runeB
                        }, function (response) {
                            if (response) {
                                // Me devuelve el objeto usuario actualizado
                                $scope.updateUserObject(response.data.user);

                                var runeCreated = response.data.result;
                                console.log(runeCreated);

                                // Mensaje growl de OK
                                $scope.growlNotification('success', $translate.instant('okFurnaceRunes'));
                                cleanForm();
                            }
                        });
                }

                /**
                 *
                 */
                function fnForgeWeapon() {
                    // Compruebo que los componentes están informados
                    if (!$scope.forge.weapon.tostem || !$scope.forge.weapon.rune || !$scope.forge.weapon.class) {
                        growl.error($translate.instant('errForgeNoValidParams'));
                        return;
                    }

                    // Llamo al API enviando los elementos para la forja
                    API.forge()
                        .weapon({
                            tostem: $scope.forge.weapon.tostem,
                            rune: $scope.forge.weapon.rune,
                            class: $scope.forge.weapon.class
                        }, function (response) {
                            if (response) {
                                // Me devuelve el objeto usuario actualizado
                                $scope.updateUserObject(response.data.user);

                                var weaponCreated = response.data.result;
                                console.log(weaponCreated);

                                // Mensaje growl de OK
                                $scope.growlNotification('success', $translate.instant('okForgeWeapon'));
                                cleanForm();
                            }
                        });
                }

                /**
                 *
                 */
                function fnForgeArmor() {
                    // Compruebo que los componentes están informados
                    if (!$scope.forge.armor.tostem || !$scope.forge.armor.rune || !$scope.forge.armor.class) {
                        growl.error($translate.instant('errForgeNoValidParams'));
                        return;
                    }

                    // Llamo al API enviando los elementos para la forja
                    API.forge()
                        .armor({
                            tostem: $scope.forge.armor.tostem,
                            rune: $scope.forge.armor.rune,
                            class: $scope.forge.armor.class
                        }, function (response) {
                            if (response) {
                                // Me devuelve el objeto usuario actualizado
                                $scope.updateUserObject(response.data.user);

                                var armorCreated = response.data.result;
                                console.log(armorCreated);

                                // Mensaje growl de OK
                                $scope.growlNotification('success', $translate.instant('okForgeArmor'));
                                cleanForm();
                            }
                        });
                }

                function cleanForm() {
                    $scope.furnace = {
                        tostem: {tostemA: '', tostemB: ''},
                        rune: {runeA: '', runeB: ''}
                    };
                    $scope.forge = {
                        weapon: {tostem: '', rune: '', class: ''},
                        armor: {tostem: '', rune: '', class: ''}
                    };
                };

                /**
                 * Callback ejecutado después de actualizar los datos
                 */
                function fnAfterUpdate() {
                }

            }]);
})();
