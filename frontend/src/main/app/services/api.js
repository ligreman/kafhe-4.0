(function () {
    'use strict';

    var myAppServices = angular.module('kafhe.services');

    // Servicio para el webservice del login.
    myAppServices.factory('API', ['$resource', '$cookies', 'CONFIG', function ($resource, $cookies, CONFIG) {

        var access_token = $cookies.get(CONFIG.sessionCookieName);

        return {
            // API de Session
            'session': function () {
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
            'user': function () {
                return $resource(CONFIG.webServiceUrl + 'user/:endpoint', {endpoint: ''}, {
                    // Obtener la información del usuario actual y su partida
                    me: {
                        method: 'GET',
                        headers: {'Authorization': 'Bearer ' + access_token},
                        params: {
                            endpoint: ''
                        }
                    },
                    // Obtener lista de usuarios de la partida
                    list: {
                        method: 'GET',
                        headers: {'Authorization': 'Bearer ' + access_token},
                        params: {
                            endpoint: 'list'
                        }
                    }
                });
            },

            // API de Order
            'order': function () {
                return $resource(CONFIG.webServiceUrl + 'order/:endpoint', {endpoint: ''}, {
                    // Obtener lo que se puede pedir
                    mealanddrink: {
                        method: 'GET',
                        headers: {'Authorization': 'Bearer ' + access_token},
                        params: {
                            endpoint: 'mealanddrink'
                        }
                    },
                    // Obtener lista de pedidos
                    list: {
                        method: 'GET',
                        headers: {'Authorization': 'Bearer ' + access_token},
                        params: {
                            endpoint: 'list'
                        }
                    }
                });
            },

            // API de Skill
            'skill': function () {
                return $resource(CONFIG.webServiceUrl + 'skill/:endpoint', {endpoint: ''}, {
                    // Obtener todas las habilidades
                    list: {
                        method: 'GET',
                        headers: {'Authorization': 'Bearer ' + access_token},
                        params: {
                            endpoint: 'list'
                        }
                    },
                    // Activa el modo furia
                    fury: {
                        method: 'POST',
                        headers: {'Authorization': 'Bearer ' + access_token},
                        params: {
                            endpoint: 'fury'
                        }
                    }
                });
            }
        }

    }]);
})();
