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
            'tostem': 'Tostem',
            'rune': 'Runa',

            // TIPOS
            'bladed': 'Cortante',
            'blunt': 'Contundente',
            'piercing': 'Perforante',
            'light': 'Ligera',
            'medium': 'Media',
            'heavy': 'Pesada',

            // ELEMENTOS
            'fire': 'Fuego',
            'water': 'Agua',
            'earth': 'Tierra',
            'air': 'Aire',

            // MATERIALES
            'madera': 'Madera',

            // FRECUENCIAS
            'common': 'Común',
            'uncommon': 'Infrecuente',
            'rare': '{GENDER, select, male{Raro} female{Rara} other{}}',
            'extraordinary': '{GENDER, select, male{Extraordinario} female{Extraordinaria} other{}}',
            'legendary': '{GENDER, select, male{Extraordinario} female{Extraordinaria} other{}}Legendario',

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
            'textLastDayOrder': 'Pedir lo del otro día',
            'textOrderNoItoTitle': 'El desayuno no es ITO',
            'textOrderNoItoContent': 'El desayuno que vas a pedir no es ITO, ¿es correcto o se te ha olvidado marcarlo?',
            'textYaMeParecia': 'Ya me parecía a mí...',
            'textOrderChanged': 'Desayuno actualizado',
            'textOrderDeleted': 'Pedido del desayuno retirado',
            'textNoLastOrder': 'Omelettus no tiene constancia de que el otro día tomaras desayuno alguno, ¡hereje!',

            // INTERFAZ - PANTALLA FORJA
            'textCombineTostemsInFurnace': 'Hornear tostems',
            'textCombineRunesInFurnace': 'Hornear runas',
            'textForgeWeapon': 'Forjar arma',
            'textForgeArmor': 'Forjar armadura',

            'okFurnaceTostems': 'Tostem horneado con éxito',
            'okFurnaceRunes': 'Runa horneada con éxito',
            'okForgeWeapon': 'Arma forjada con éxito',
            'okForgeArmor': 'Armadura forjada con éxito',
            'errFurnaceNoValidTostems': 'No has seleccionado dos tostem válidos',
            'errFurnaceNoValidRunes': 'No has seleccionado dos runas válidas',
            'errForgeNoValidParams': 'No has seleccionado todos los ingredientes necesarios',

            // ERRORES - GENERAL
            'errGenericException': 'Ocurrió un error desconocido',
            'errServerException': 'El servidor no responde',

            // ERRORES - LOGIN
            'errUserPassNotValid': 'Usuario o contraseña no válidos',

            // ERRORES - SESSION
            'errSession': 'No se ha encontrado una sesión válida'
            //'errSessionUtils0002': 'La sesión ha caducado'


        };

        $translateProvider.translations('es', espanol);
    }]);
})();
