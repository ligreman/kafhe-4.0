(function () {
    'use strict';

    var utilsModule = angular.module('kafhe.services');

    //Defino el servicio concreto de auteticación
    utilsModule.factory('KCommon', ['CONSTANTS',
        function (CONSTANTS) {

            //Devuelve un valor númerico para los países: -1 si es SPAIN,
            // 1 si es DESCONOCIDO y 0 en otro caso
            var valueOfCountry = function (country) {
                var result = 0;

                if (country === CONSTANTS.spain) {
                    result = -1;
                }

                if (country === undefined) {
                    result = 1;
                }

                return result;
            };


            /**
             * Compara los países siendo SPAIN primero, después comparacion alfanumérica
             * y finalmente DESCONOCIDO
             * @param countryA
             * @param countryB
             * @returns {number}
             */
            var compareCountry = function (countryA, countryB) {
                //Calculo el valor de cada país
                var vA = valueOfCountry(countryA, CONSTANTS);
                var vB = valueOfCountry(countryB, CONSTANTS);

                //Esta resta da la comparación de valor de países
                var result = vA - vB;

                //Si el resultado es 0 puede ser que ambos son países conocidos distintos de 'SPAIN', así que los comparamos
                if (result === 0) {
                    result = String(countryA).localeCompare(countryB);
                }

                return result;
            };

            //Compara dos IPs
            var compareIp = function (ipA, ipB) {
                var result = 0;

                if (ipA < ipB) {
                    result = -1;
                }

                if (ipA > ipB) {
                    result = 1;
                }

                return result;
            };

            /**
             * Obtiene un valor numérico en base 256 para una IP
             * @param ip
             * @returns {number}
             */
            var getIpNumber = function (ip) {
                var ipArray = ip.split('.');

                //Hago la conversión de la IP a formato numérico y la devuelvo
                return parseInt(ipArray[0]) * 16777216 + parseInt(ipArray[1]) * 65536 + parseInt(ipArray[2]) * 256 + parseInt(ipArray[3]);
            };

            //Expongo los métodos del servicio
            return {
                valueOfCountry: valueOfCountry,
                compareCountry: compareCountry,
                compareIp: compareIp,
                getIpNumber: getIpNumber
            };
        }
    ]);


})();