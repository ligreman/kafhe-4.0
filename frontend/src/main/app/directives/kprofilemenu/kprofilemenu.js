(function () {
    'use strict';

    var app = angular.module('kafhe.directives');

    app.directive('kProfileMenu', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'app/directives/kprofilemenu/kprofilemenu.html',
            controller: ['$scope', 'API', function ($scope, API) {

                $scope.logout = fnLogout;

                /*********************************************************************/
                /*********************** FUNCIONES ***********************************/

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
