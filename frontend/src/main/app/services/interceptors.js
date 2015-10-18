(function () {
    'use strict';

    var interceptorModule = angular.module('kafhe.services');

    interceptorModule.factory('KInterceptor',
        ['$rootScope', '$q', '$translate', '$location', 'CONFIG', 'ROUTES', '$cookies', 'KSession',
            function ($rootScope, $q, $translate, $location, CONFIG, ROUTES, $cookies, KSession) {
                return {
                    /**
                     * Peticiones
                     * Se comprobará que está iniciada la sesión (que existe la cookie)
                     * @param config
                     * @returns {*}
                     */
                    'request': function (config) {
                        var galleta = $cookies.get(CONFIG.sessionCookieName);

                        //Si es una petición de webservice, pero no de login te saco fuera
                        if (galleta === undefined &&
                            config.url.indexOf(CONFIG.webServiceUrl) !== -1 &&
                            config.url.indexOf(ROUTES.loginValidation) === -1) {

                            $translate('errValidUser0001').then(function (translation) {
                                ngToast.create({
                                    className: 'danger',
                                    content: translation
                                });
                            });

                            KSession.logout();
                        }

                        return config;
                    },

                    /**
                     * Aquí llegarán sólo las respuestas con código 200
                     * Actualizo la cookie con el token
                     * si es que viene informado el campo session en response
                     * @param response
                     * @returns {*}
                     */
                    'response': function (response) {
                        if (response.config.url.indexOf(CONFIG.webServiceUrl) !== -1) {
                            var isError = false, code;

                            //Compruebo que me viene el campo session en la respuesta
                            if (response.data.session) {
                                isError = (response.data.error !== '');
                                code = response.data.code;
                            } else {
                                isError = true;
                                code = 'errNoSession';
                            }

                            //Si isError es true es que ha pasado algo raro
                            if (isError) {
                                //Muestro el toast con el error
                                $translate(code).then(function (translation) {
                                    /*ngToast.create({
                                     className: 'danger',
                                     content: translation
                                     });*/
                                });

                                //Le saco
                                KSession.logout();

                                //Rechazo la promise para que corte la ejecución
                                return $q.reject(response);
                            } else {
                                //Renuevo la sesión
                                KSession.refresh(response.data.session);
                            }
                        }
                        return response;
                    },


                    /**
                     * Aquí llegarán sólo las respuestas con código distinto de 200
                     * Actualizo la cookie con el token
                     * si es que viene informado el campo session en response
                     * @param rejection
                     * @returns {*}
                     */
                    'responseError': function (rejection) {
                        //Si es una respuesta de una llamada al API
                        if (rejection.config.url.indexOf(CONFIG.webServiceUrl) !== -1) {
                            //Recupero el código de error
                            var errorCode = rejection.data.error;

                            //Muestro el toast con el error
                            $translate(errorCode).then(function (translation) {
                                /*ngToast.create({
                                 className: 'danger',
                                 content: translation
                                 });*/
                            });

                            //Si es un error de algo de sesiones le saco
                            if (CONFIG.errorCodesSession.indexOf(errorCode) !== -1) {
                                KSession.logout();
                            }

                            //Renuevo la sesión
                            KSession.refresh(rejection.data.session);
                        }

                        //Respuesta cortando la ejecución del controller
                        return $q.reject(rejection);
                    }
                };
            }]);
})();