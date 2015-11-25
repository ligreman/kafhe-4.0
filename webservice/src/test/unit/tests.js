/*

 //Cargo la librería chai y los módulos que necesite
 var expect  = require('chai').expect,
 mockery = require('mockery'),
 request = require('supertest');

 // Creo un app para los tests
 var express      = require('express'),
 ROOT_DIR     = __dirname + '/../../main',
 bodyParser   = require('body-parser'),
 app          = express(),
 mongooseMock = require('mongoose-mock'),
 mongoose     = require('mongoose'),
 proxyquire   = require('proxyquire');

 //var models = require('../../main/models/models')(mongooseMock);


 // all environments
 app.use(bodyParser.urlencoded({extended: false}));
 app.use(bodyParser.json());

 //This allows you to require files relative to the root in any file
 requireFromRoot = (function (root) {
 return function (resource) {
 return require(root + "/" + resource);
 }
 })(ROOT_DIR);

 describe('#/api/user', function () {
 //var log = console.log;
 var Game, User, Admin, Session, Meal, Drink, Skill;
 //Game = models.Game;


 before(function (done) {
 require(ROOT_DIR + '/routes/user')(app);
 done();
 });

 beforeEach(function () {

 //Game = models.Game;
 //User: mongoose.model('User');
 //Admin: mongoose.model('Admin'),
 //Session: mongoose.model('Session'),
 //Meal: mongoose.model('Meal'),
 //Drink: mongoose.model('Drink'),
 //Skill: mongoose.model('Skill')

 //Game = proxyquire('../../main/models/game', {'mongoose': mongooseMock});
 //User = proxyquire('../../main/models/user', {'mongoose': mongooseMock});
 //Admin = proxyquire('../../main/models/admin', {'mongoose': mongooseMock});
 //Session = proxyquire('../../main/models/session', {'mongoose': mongooseMock});
 //Meal = proxyquire('../../main/models/meal', {'mongoose': mongooseMock});
 //Drink = proxyquire('../../main/models/drink', {'mongoose': mongooseMock});
 //Skill = proxyquire('../../main/models/skill', {'mongoose': mongooseMock});

 // Done to prevent any server side console logs from the routes
 // to appear on the console when running tests
 //console.log = function () {
 //};

 });

 it('- should GET users', function (done) {
 //request(app)
 //    .get('/user')
 //    .end(function (err, res) {
 //        console.log(err);
 //        console.log(res);
 //        console.log(JSON.parse(res.text));
 //        // Enable the console log to print the assertion output
 //        //console.log = log;
 //        //var data = JSON.parse(res.text);
 //        //expect(err).to.be.null;
 //        //expect(data.length).to.equal(3);
 //        done();
 //    });
 });
 /!*
 it('- should GET a user at index (1)', function (done) {
 request(app)
 .get('/api/users/1')
 .end(function (err, res) {
 // Enable the console log
 //console.log = log;
 var data = JSON.parse(res.text);
 expect(err).to.be.null;
 expect(data.name).to.equal('Jony Ive');
 done();
 });
 });

 it('- should POST a user and get back a response', function (done) {
 var user = {
 name: 'Steve Wozniak'
 };

 request(app)
 .post('/api/users')
 .send(user)
 .end(function (err, res) {
 // Enable the console log
 //console.log = log;
 var data = JSON.parse(res.text);
 expect(err).to.be.null;
 expect(data.name).to.equal(user.name);
 done();
 });
 });*!/

 });
 */


/*

 describe('Test Utils library', function () {
 //Tests de la función 'getRespuesta'
 describe('TestGetRespuesta', function () {
 var utils = require('../../main/modules/utils');
 it('Debería existir la función', function () {
 expect(utils.getRespuesta).to.be.a('function');
 });

 it('Lo que devuelve getRespuesta', function () {
 expect(utils.getRespuesta('Manolo')).to.be.equal('Hola Manolo');
 });
 });

 //Tests de la función 'getFuncionAMockear' sin mockear
 describe('TestGetFuncionAMockear sin mock', function () {
 var utils = require('../../main/modules/utils');

 //Los tests
 it('Debería existir la función', function () {
 expect(utils.getFuncionAMockear).to.be.a('function');
 });

 it('Lo que devuelve getRespuesta', function () {
 expect(utils.getFuncionAMockear('Pedrito')).to.be.equal('Original Pedrito');
 });
 });

 //Tests de la función 'getFuncionAMockear' mockeada
 describe('TestGetFuncionAMockear mockeada', function () {
 var utils;

 //Creo el mock de la función que me interesa
 var utilsMock = {
 getFuncionAMockear: function (parametro) {
 return 'Soy un mock ' + parametro;
 }
 };

 //Antes de nada activo el mockery y lo configuro
 before(function () {
 mockery.enable({
 warnOnReplace: false,
 warnOnUnregistered: false,
 useCleanCache: true
 });

 //Registro mi librería utilsMock como utils
 mockery.registerMock('../../main/modules/utils', utilsMock);

 //Cargo aquí los módulos que necesito para que el Mock haga el
 // "man-in-the-middle" correctamente. Si no, al intentar registrar el mock
 // ya estaría cargada la librería original y no se podría sobrescribir.
 // Puedo cargarlo en los it, si necesitase diferentes módulos para cada uno.
 utils = require('../../main/modules/utils');
 });

 //Antes de cada test podría hacer cosas. Se ejecuta después del before.
 beforeEach(function () {
 });

 //Después de cada test podría hacer cosas
 afterEach(function () {
 });

 //Al terminar hago lo siguiente
 after(function () {
 //Desactivo mockery
 mockery.disable();
 });

 //Los tests
 it('Debería existir la función', function () {
 expect(utils.getFuncionAMockear).to.be.a('function');
 });

 it('Lo que devuelve getRespuesta', function () {
 //Espero que me devuelva el resultado del mock
 expect(utils.getFuncionAMockear('Manolo')).to.be.equal('Soy un mock Manolo');
 });
 });

 });
 */

