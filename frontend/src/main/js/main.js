'use strict';

(function($){
  $(function(){

    $('.button-collapse').sideNav();

  }); // end of document ready
})(jQuery); // end of jQuery name space



//----- Test script code -----

console.log(a(2));

function a(num) {
    if (num > 0) {
        return num + 1;
    } else {
        return true;
    }
}

/**
 * Ejemplo simple para mock. Una función c pide el resultado a devolver a otras
 * funciones. Se devería intentar usar siempre funciones encapsuladas en variables
 * como b1, y no como b2.
 */
var b1 = function () {
    return 'Pepe';
};

function b2() {
    return 'Manolo';
}

function c(type) {
    if (type === 1) {
        return b1();
    } else if (type === 2) {
        return b2();
    }
}

/**
 * Otro ejemplo de mockeo de functiones encapsuladas.
 */
var utils = {
    frase: function () {
        return 'Buenos días'
    },
    saluda: function () {
        return this.frase();
    }
};

/**
 * Ejemplo de función que llama a un servicio REST
 */
var dameDatos = function () {
    //Aqui la función llamaría a un servicio REST y obtendría un JSON de respuesta

    //No lo hacemos realmente y simulamos en la función que el servicio devuelve un error
    return {
        respuesta: '',
        error: 'No se está mockeando'
    }
};
