(function () {
    'use strict';

    var myAppServices = angular.module('kafhe.services');

    // Servicio para el webservice del login.
    myAppServices.factory('API', ['$resource', 'CONFIG', function ($resource, CONFIG) {
        return {
            // API de Session
            'session': function (access_token) {
                return $resource(CONFIG.webServiceUrl + ':endpoint', {
                    endpoint: '',
                    username: '@username',
                    password: '@password'
                }, {
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
            },

            // API de User
            'user': function (access_token) {

            }
        }

    }]);
})();
