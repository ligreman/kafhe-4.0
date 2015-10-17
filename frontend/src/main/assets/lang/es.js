(function () {
    'use strict';

    //Idioma español
    angular.module('kafhe').config(['$translateProvider', function ($translateProvider) {
        var espanol = {
            // TEXTOS - GENERAL
            'textErrors': 'Errores',
            'textCancel': 'Cancelar',
            'textAccept': 'Acceptar',
            'textYes': 'Sí',
            'textNo': 'No',

            // INTERFAZ - INDEX
            'indexUser': 'Usuario: ',
            'indexLogout': 'Salir',

            // INTERFAZ - LOGIN
            'loginSignInButton': 'Entrar',
            'loginFormTitle': 'Acceso',
            'loginUserLabel': 'Usuario',
            'loginPasswordLabel': 'Contraseña',

            // INTERFAZ - NAVEGACIÓN
            'tabIp': 'IP',
            'tabDomain': 'Dominio',
            'tabUrl': 'URL',
            'tabHash': 'Hash',
            'tabLiteral': 'Literal',

            // INTERFAZ - BOTONES
            'buttonSearch': 'Todas las búsquedas',
            'labelSearch': 'Búsqueda',

            // INTERFAZ - TOOLTIP
            'titleSearchesHistory': 'Ir a Historial de Busquedas',

            // INTERFAZ - FORMULARIOS GENERAL
            'textAreaIpSearch': 'Buscar Ips',
            'textAreaDomainSearch': 'Buscar Dominios',
            'textAreaHashSearch': 'Buscar Hash',
            'textAreaUrlSearch': 'Buscar Urls',
            'confirmDeleteSearch': '¿Quieres borrar los elementos seleccionados?',

            // INTERFAZ - BÚSQUEDAS
            'myOrgSearches': 'Búsquedas de mi organización',
            'allSearches': 'Todas las búsquedas',
            'mySearches': 'Mis búsquedas',
            'deleteSearches': 'Borrar búsquedas',
            'buttonDelete': 'Borrar',

            // INTERFAZ - IMPORTAR FICHERO CSV
            "csvLoadingFile": 'Cargando fichero CSV',
            "csvLoadedFile": 'Cargado el fichero CSV',
            "csvNotTextFile": 'No es un fichero de texto',
            "csvMaxSizeExceeded": 'Se ha excedido el tamaño máximo del fichero',
            "csvUpload": 'Subir un fichero CSV',
            'csvYouCanDropText': 'También puedes arrastrar y soltar un fichero CSV aquí',
            'overlayDropHere': 'Arrastra aquí el fichero',
            'overlayTitle': 'Importar IPs desde CSV',
            'overlayDelimiterLabel': 'Carácter separador de campos en el',
            'overlayDelimiterError': 'Introduce el separador',
            'overlayHasHeadersLabel': 'La primera fila del fichero contiene encabezados',
            'overlayColumnsLabel': 'Selecciona las columnas que contienen IPs',
            'abbrCSV': 'Fichero con valores separados por comas',

            // INTERFAZ - COLUMNAS TABLAS BÚSQUEDAS
            'searchesName': 'Nombre',
            'searchesDate': 'Fecha',
            'searchesDataType': 'Tipo de dato',
            'searchesSearchType': 'Tipo de búsqueda',
            'searchesUser': 'Usuario',

            // INTERFAZ - COLUMNAS DE TABLAS BÚSQUEDA ÚNICA
            'uniqueSearchIp': 'IP',
            'uniqueSearchCountry': 'País',
            'uniqueSearchCategory': 'Categoría',
            'uniqueSearchEventDate': 'Fecha del evento',
            'uniqueSearchThreat': 'Amenaza',
            'uniqueSearchDetail': 'Detalle',
            'uniqueSearchSeverity': 'Severidad',

            // CAMPOS DETALLE
            'detailDate': 'Fecha',
            'detailOrganization': 'Organización',
            'detailUser': 'Usuario',
            'detailGroupBy': 'Agrupación',
            'detailGroupByCountryCategory': 'País y categoría',
            'detailGroupByCountry': 'País',
            'detailGroupByCategory': 'Categoría',
            'detailTitle': 'IP',
            'detailCategory': 'Categoría',
            'detailThreat': 'Amenaza',
            'detailDetail': 'Detalle',
            'detailSeverity': 'Severidad',
            'detailCountryCode': 'Código de país',
            'detailCountry': 'País',
            'detailEventDate': 'Fecha',
            'detailPort': 'Puerto',
            'detailConfidence': 'Confianza',
            'detailPriority': 'Prioridad',
            'detailLatitude': 'Latitud',
            'detailLongitude': 'Longitud',

            'detailContinent': 'Continente',
            'detailCountry_Name': 'Nombre del país',
            'detailRegion': 'Comunidad Autónoma',
            'detailProvince': 'Provincia',
            'detailCity': 'Ciudad',
            'detailTimeZone': 'Zona horaria',
            'detailPostalCode': 'Código Postal',

            'noShowMap': 'No se han encontrado IPs españolas, por tanto no se muestra el mapa de geolocalización.',
            'editNameFormat': 'Longitud entre 4 y 30 caracteres. Caracteres permitidos: mayúsculas y minúsculas, números, espacio y los símbols  -_:./',

            'IPTitle': 'IP',
            'categoriesTitle': 'Categorías',
            'threatsTitle': 'Amenazas',

            // ERRORES - GENERAL
            'errGenericException': 'Ocurrió un error desconocido',

            // ERRORES DE VALIDACIÓN DE CSV
            'importErrorFile': 'Fichero no válido',
            'importErrorQuotes': 'El fichero contiene errores de entrecomillado',
            'importErrorRows': 'El fichero contiene filas con un número de campos incorrecto',
            'importErrorAllIpsNotValid': 'El fichero no contiene IPs válidas',
            'importErrorIpNotValid': 'El fichero contiene IPs no válidas que no se procesarán',
            'importErrorMaxIPsExceeded': 'Se ha superado el máximo de IPs permitidas',
            'errCSVPreviewFieldMismatchLines': 'Se han detectado filas con un número de campos incorrecto (Líneas: {{value}})',
            'errCSVPreviewFile': 'El fichero no es un CSV válido o está vacío',

            // ERRORES - LOGIN
            //    El usuario no insertó un login de LDAP válido
            'errLDAP0002': 'Usuario y/o contraseña incorrectos',
            //    Error recuperando credenciales del usuario. No figura como usuario o como administrador.
            'errLDAP0003': 'Usuario y/o contraseña incorrectos',
            //    Falta la cabecera X_INCIBE_WS_Client_IP.
            'errPostLogin0002': 'Usuario y/o contraseña incorrectos',
            //    El usuario no insertó un login válido por expresión regular.
            'errPostLogin0001': 'Usuario y/o contraseña incorrectos',

            // ERRORES - SESSION
            //    Error de parsing recuperando el timestamp de sesión.
            'errSessionUtils0002': 'La sesión ha caducado',
            //    Error recuperando el tiempo de expiración.
            'errSessionUtils0003': 'La sesión ha caducado',
            //    Error recuperando SLC_SESSION_MAX_TIME en slc.properties.
            'errValidSession0002': 'La sesión ha caducado',
            //    No se ha encontrado la sesión.
            'errNoSession': 'La sesión ha caducado',
            'errValidUser0001': 'La sesión ha caducado',
            'errValidUser0002': 'La sesión ha caducado', //El servidor no ha podido recuperar la petición (request)
            'errValidUser0003': 'La sesión ha caducado', //Falta la cabecera X_INCIBE_WS_Client_IP
            'errValidUser0004': 'La sesión ha caducado', //La sesión se está iniciando desde una dirección IP diferente a la empleada con anterioridad

            //    Error generando el token: No existe el algoritmo especificado.
            'errToken0001': 'La sesión ha caducado',

            // ERRORES - IP SEARCH
            'errSearchIP0001': 'Se superó el máximo de IPs permitidas',
            'errSearchIP0002': 'Existen Ips duplicadas',
            'errSearchIP0003': 'No se ha introducido ninguna IP',
            'errSearchIP0004': 'Algunas de las ips no tienen un formato válido',

            // ERRORES - SEARCH
            'errOrgSearches0001': 'Error al validar el listado de búsquedas',
            'errOrgSearches0002': 'Error en el listado de búsquedas',

            // ERRORES - SEARCH ID
            'errSearchID0001': 'No se ha podido encontrar la búsqueda solicitada',
            'errSearchID0002': 'No se obtienen resultados para la búsqueda solicitada',

            // ERRORES - DELETE SEARCH
            'errDeleteSearch0001': 'Una o varias búsquedas no han podido ser borradas',
            'errDeleteSearch0002': 'Error en el formato de los IDs de las búsquedas',
            'errDeleteSearch0003': 'Error al eliminar las búsquedas',

            //ERRORES - EDIT SEARCH
            'errEditSearch0001': 'No se pudo editar el nombre de la búsqueda.',
            'errEditSearch0002': 'No se pudo editar el nombre de la búsqueda.',
            'errEditSearch0003': 'El nuevo nombre sólo puede contener letras (mayúsculas o minúsculas), números y los símbolos  -  :./ y con una longitud mínima de 4 y máxima de 30.',
            'errEditSearch0004': 'Ya existe otra búsqueda con el mismo nombre.',
            'errEditSearch0005': 'Ya existe otra búsqueda con el mismo nombre.',
            'errEditSearch0006': 'No se pudo editar el nombre de la búsqueda.',
            'errEditSearch0007': 'No se pudo editar el nombre de la búsqueda.',
            'errEditSearch0008': 'No se puede editar el nombre de una búsqueda de otro usuario.',

            // ERRORES - LOGOUT
            'errLogOut0001': 'Error al realizar operación log-out',

            // WARNING - WARNING
            'warnDeleteSearch0001': 'Hay búsquedas seleccionadas que no pertenecen al usuario.',

            // OK - CONFIRMACIÓN
            'okDeleteSearch0001': 'El borrado se ha realizado con éxito.',
            'okLogOut0001': 'Logout realizado correctamente.'
        };

        $translateProvider.translations('es', espanol);
    }]);
})();