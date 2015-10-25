(function () {
    'use strict';

    //Idioma español
    angular.module('kafhe').config(['$translateProvider', function ($translateProvider) {
        var espanol = {
            // TEXTOS - GENERAL
            'textError': 'Error',
            'textErrors': 'Errores',
            'textCancel': 'Cancelar',
            'textAccept': 'Aceptar',
            'textYes': 'Sí',
            'textNo': 'No',

            // INTERFAZ - HEADER
            'headerUser': 'Usuario: ',
            'headerLogout': 'Salir',

            // INTERFAZ - LOGIN
            'loginSignInButton': 'Entrar',
            'loginUserLabel': 'Usuario',
            'loginPasswordLabel': 'Contraseña',

            // INTERFAZ - PANTALLA DESAYUNO
            'textNewOrder': 'Hacer pedido',
            'textChangeOrder': 'Cambiar el pedido',
            'textCancelOrder': 'Eliminar el pedido',
            'textLastDayOrder': 'Lo del otro día',


            // ERRORES - GENERAL
            'errGenericException': 'Ocurrió un error desconocido',
            'errServerException': 'El servidor no responde',

            // ERRORES - LOGIN
            'errValidUser0001': 'Usuario o contraseña no válidos',

            // ERRORES - SESSION
            'errSessionUtils0001': 'No se ha encontrado una sesión válida',
            'errSessionUtils0002': 'La sesión ha caducado'


        };

        $translateProvider.translations('es', espanol);
    }]);
})();