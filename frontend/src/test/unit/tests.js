/**
 * Sobreescribo la función b2 para 'mockearla'.
 * Al no estar encapsulada la función, tengo que hacerlo de esta forma
 * poco elegante
 */
function b2() {
    return 'Paco2';
}

describe('Tests', function () {

    //Tests de la función 'a'
    describe('TestA', function () {
        it('Debería existir la función', function () {
            expect(a).to.be.a('function');
        });

        it('Lo que devuelve a', function () {
            expect(a(2)).to.be.equal(3);
            expect(a(0)).to.be.true;
        });
    });

    //Test de 'b' y 'c'. Mockeo la función b para que devuelva otra cosa
    describe('TestBC', function () {
        it('C debería devolver el valor del mock', function () {
            //Sobreescribo la variable b1 que contiene la función que quiero mockear
            b1 = function () {
                return 'Paco1';
            };

            expect(c(1)).to.be.equal('Paco1');
            expect(c(2)).to.be.equal('Paco2');
        });
    });

    //Tests de utils con mock usando Sinon.js
    describe('TestUtils', function () {
        it('Mockeo la frase para saludar por la tarde', function () {
            var stub = sinon.stub(utils, 'frase', function () {
                return 'Buenas tardes'
            });

            //Cuando termino, restauro el stub para eliminarlo y que la
            //función original deje de estar mockeada para próximos tests.
            after(function () {
                stub.restore();
            });

            expect(utils.saluda()).to.be.equal('Buenas tardes');
        });
    });

    // Test de una consulta a un API REST mockeada
    describe('TestREST', function () {
        var server, fakeData = {
            respuesta: 'Datos mockeados',
            error: ''
        }, fakeData2 = {
            respuesta: 'Datos mockeados 2',
            error: ''
        };

        //Preparo las respuestas del servidor REST mockeado
        before(function () {
            server = sinon.fakeServer.create();
            server.respondWith(
                'GET',
                'http://url.que.quiero.mockear.com',
                [200, {"Content-Type": "application/json"}, JSON.stringify(fakeData)]
            );
            server.respondWith(
                'GET',
                'http://url.que.quiero.mockear.asincrona.com',
                [200, {"Content-Type": "application/json"}, JSON.stringify(fakeData2)]
            );
        });

        //Restauro el servicio para dejarlo como estaba al principio
        after(function () {
            server.restore();
        });

        it('Debería obtener la respuesta del mock síncrona', function (done) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', 'http://url.que.quiero.mockear.com', false);
            xmlhttp.send(null);
            var response = JSON.parse(xmlhttp.responseText);

            expect(response.respuesta).to.be.equal('Datos mockeados');

            //Le digo a Mocha que he terminado con las peticiones Ajax
            done();
        });

        it('Debería obtener la respuesta del mock asíncrona', function (done) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', 'http://url.que.quiero.mockear.asincrona.com', false);
            xmlhttp.send(null);
            var response = JSON.parse(xmlhttp.responseText);

            expect(response.respuesta).to.be.equal('Datos mockeados 2');

            //Digo al servidor mock que devuelva ahora las respuestas asíncronas
            server.respond();

            //Le digo a Mocha que he terminado con las peticiones Ajax
            done();
        });
    });
});
