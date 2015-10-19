(function () {
    'use strict';

    //Idioma español
    angular.module('kafhe').config(['$translateProvider', function ($translateProvider) {
        var espanol = {
            // TEXTOS - GENERAL
            'textError': 'Error',
            'textErrors': 'Errores',
            'textCancel': 'Cancelar',
            'textAccept': 'Acceptar',
            'textYes': 'Sí',
            'textNo': 'No',

            // INTERFAZ - HEADER
            'headerUser': 'Usuario: ',
            'headerLogout': 'Salir',

            // INTERFAZ - LOGIN
            'loginSignInButton': 'Entrar',
            'loginFormTitle': 'Acceso',
            'loginUserLabel': 'Usuario',
            'loginPasswordLabel': 'Contraseña',

            // INTERFAZ - FORMULARIOS GENERAL
            'textAreaIpSearch': 'Buscar Ips',
            'textAreaDomainSearch': 'Buscar Dominios',
            'textAreaHashSearch': 'Buscar Hash',
            'textAreaUrlSearch': 'Buscar Urls',
            'confirmDeleteSearch': '¿Quieres borrar los elementos seleccionados?',


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