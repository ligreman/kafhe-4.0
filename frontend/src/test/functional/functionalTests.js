casper.test.begin('Google homepage', 3, function suite(test) {
    casper.start('https://www.google.com/', function () {
        //Compruebo que el título de la página home es el esperado
        test.assertTitle('Google', 'Google homepage title is the one expected');

        //Compruebo que existe un formulario de búsqueda
        test.assertExists('form', 'form found');

        // Relleno el formulario de búsqueda mediante CSS3
        this.fillSelectors('form', {
            'input': 'ligreman'
        }, true);
    });

    casper.then(function () {
        //Compruebo que existen al menos 5 bloques div de resultados
        test.assertEval(function () {
            return __utils__.findAll('ol li').length >= 5;
        }, 'Google search for "ligreman" retrieves 5 or more results');
    });

    // Ejecuto los tests
    casper.run(function () {
        test.done();
    });
});
