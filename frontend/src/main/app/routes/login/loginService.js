(function () {
    'use strict';

    var myAppServices = angular.module('kafhe.services');

    // Servicio para el webservice del login.
    myAppServices.factory('APISession', ['$resource', 'CONFIG', function ($resource, CONFIG) {
        return {
            'session': function (access_token) {
                return $resource(CONFIG.webServiceUrl + ':endpoint', {endpoint: ''}, {
                    // método LOGIN, envía user y passwd
                    login: {
                        method: 'POST',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        params: {
                            endpoint: 'login'
                        }
                    },
                    logout: {
                        method: 'GET',
                        headers: {'Authorization': 'Bearer ' + access_token},
                        params: {
                            endpoint: 'logout'
                        }
                    }
                });
            }
        }

    }]);
})();