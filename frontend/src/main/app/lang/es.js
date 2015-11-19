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
            'textContinue': 'Continuar',
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
            'textChangeOrder': 'Cambiar el desayuno',
            'textCancelOrder': 'Eliminar el desayuno',
            'textLastDayOrder': 'Lo del otro día',
            'textOrderNoItoTitle': 'El desayuno no es ITO',
            'textOrderNoItoContent': 'El desayuno que vas a pedir no es ITO, ¿es correcto o se te ha olvidado marcarlo?',
            'textYaMeParecia': 'Ya me parecía a mí...',
            'textOrderChanged': 'Desayuno actualizado',
            'textOrderDeleted': 'Pedido del desayuno retirado',
            'textNoLastOrder': 'Omelettus no tiene constancia de que el otro día tomaras desayuno alguno, ¡hereje!',

            // INTERFAZ - PANTALLA FORJA
            'textCombineInFurnace': 'Hornear',

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
