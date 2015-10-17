(function () {
    'use strict';

    //Defino el módulo para importarlo como dependencia donde se requiera
    var validatorsModule = angular.module('kafhe.services');

    //Defino el servicio concreto de autenticación
    validatorsModule.factory('KValidator',
        ['CONSTANTS',
            function (CONSTANTS) {

                /**
                 * Comprueba si un fichero excede un tamaño concreto
                 * @param file Fichero en formato html5
                 * @param maxSize Tamaño máximo permitido
                 * @returns {boolean}
                 */
                var validateFileSize = function (file, maxSize) {
                    return file.size <= maxSize;
                };

                /**
                 * Valida un fichero CSV (que sea fichero de texto y su tamaño no sea excesivo)
                 * @param content
                 * @returns {boolean}
                 */
                var validateCsv = function (content) {
                    var unicode = /^[A-z0-9\u0000-\u024F\u20A0-\u20BD]*$/;
                    return unicode.test(content);
                };

                /**
                 * Valida una IP
                 * @param ip
                 * @returns {boolean} True o false según sea válida o no
                 */
                var validateIp = function (ip) {
                    var regexp = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

                    return regexp.test(ip);
                };

                //Expongo los métodos del servicio
                return {
                    validateFileSize: validateFileSize,
                    validateCsv: validateCsv,
                    validateIp: validateIp
                };
            }
        ]);
})();