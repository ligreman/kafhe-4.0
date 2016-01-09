(function () {
    'use strict';

    var myAppServices = angular.module('kafhe.services');

    // Servicio para el webservice del login.
    myAppServices.factory('API', ['$resource', '$cookies', 'CONFIG', function ($resource, $cookies, CONFIG) {

        return {
            // API de Session
            'session': function () {
                // Lo pongo aquí para que se ejecute en cada consulta, y no una sola vez
                var access_token = $cookies.get(CONFIG.sessionCookieName);

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
                var access_token = $cookies.get(CONFIG.sessionCookieName);

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
                var access_token = $cookies.get(CONFIG.sessionCookieName);

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
                    },

                    // Obtener lista de jugadores que ya metieron desayuno
                    status: {
                        method: 'GET',
                        headers: {'Authorization': 'Bearer ' + access_token},
                        params: {
                            endpoint: 'status'
                        }
                    },

                    // Envía un nuevo pedido
                    create: {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Content-Type': 'application/json'
                        },
                        params: {
                            endpoint: ''
                        }
                    }
                });
            },

            // API de Furnace
            'furnace': function () {
                var access_token = $cookies.get(CONFIG.sessionCookieName);

                return $resource(CONFIG.webServiceUrl + 'furnace/:endpoint', {endpoint: ''}, {
                    // Hornear tostems
                    tostem: {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Content-Type': 'application/json'
                        },
                        params: {
                            endpoint: 'tostem'
                        }
                    },
                    // Hornear runas
                    rune: {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Content-Type': 'application/json'
                        },
                        params: {
                            endpoint: 'rune'
                        }
                    }
                });
            },

            // API de Forge
            'forge': function () {
                var access_token = $cookies.get(CONFIG.sessionCookieName);

                return $resource(CONFIG.webServiceUrl + 'forge/:endpoint', {endpoint: ''}, {
                    // Forjar armas
                    weapon: {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Content-Type': 'application/json'
                        },
                        params: {
                            endpoint: 'weapon'
                        }
                    },
                    // Forjar armaduras
                    armor: {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Content-Type': 'application/json'
                        },
                        params: {
                            endpoint: 'armor'
                        }
                    }
                });
            },

            // API de Equipo
            'equipment': function () {
                var access_token = $cookies.get(CONFIG.sessionCookieName);

                return $resource(CONFIG.webServiceUrl + 'equipment/:endpoint', {endpoint: ''}, {
                    // Equipar objeto
                    equip: {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Content-Type': 'application/json'
                        },
                        params: {
                            endpoint: 'equip'
                        }
                    },
                    // Destruir objeto
                    destroy: {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Content-Type': 'application/json'
                        },
                        params: {
                            endpoint: 'destroy'
                        }
                    }
                });
            },

            // API de Skill
            'skill': function () {
                var access_token = $cookies.get(CONFIG.sessionCookieName);

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
                        method: 'GET',
                        headers: {'Authorization': 'Bearer ' + access_token},
                        params: {
                            endpoint: 'fury'
                        }
                    },
                    // Ejecuta una habilidad
                    execute: {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Content-Type': 'application/json'
                        },
                        params: {
                            endpoint: 'execute'
                        }
                    }
                });
            },

            // API de Shop
            'shop': function () {
                var access_token = $cookies.get(CONFIG.sessionCookieName);

                return $resource(CONFIG.webServiceUrl + 'shop/:endpoint', {endpoint: ''}, {
                    // Obtener todos los objetos
                    list: {
                        method: 'GET',
                        headers: {'Authorization': 'Bearer ' + access_token},
                        params: {
                            endpoint: 'list'
                        }
                    },
                    // Compra un objeto
                    buy: {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Content-Type': 'application/json'
                        },
                        params: {
                            endpoint: 'buy'
                        }
                    }
                });
            },

            // API de desarrollo
            'dev': function () {
                return $resource(CONFIG.webServiceUrl + 'dev/:endpointA/:endpointB/:status', {
                    endpointA: '',
                    endpointB: ''
                }, {
                    resetmongo: {
                        method: 'GET',
                        params: {
                            endpointA: 'mongo'
                        }
                    },
                    gamestatus: {
                        method: 'GET',
                        params: {
                            endpointA: 'game',
                            endpointB: 'status'
                        }
                    }
                });
            }
        }

    }]);
})();
