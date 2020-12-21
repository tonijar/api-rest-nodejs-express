const request = require('supertest')
const app = require('../index')

describe('Test store, update, get and delete functinalities from user RESTful API', () => {
  it('get user but none created yet', async () => {
    const res = await request(app)
      .get('/usuario')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(true);
        expect(response.body["codigo"]).toEqual(501);
        expect(response.body["mensaje"]).toEqual('El usuario no ha sido creado');
      })
  })
  it('delete user but none created yet', async () => {
    const res = await request(app)
      .delete('/usuario')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(true);
        expect(response.body["codigo"]).toEqual(501);
        expect(response.body["mensaje"]).toEqual('El usuario no ha sido creado');
      })
  })
  it('create new user with invalid parameters', async () => {
    const res = await request(app)
      .post('/usuario')
      .send({
        "nombre2": 'nombre1',
        "apellido2": 'apellido1',
      })
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(true);
        expect(response.body["codigo"]).toEqual(502);
        expect(response.body["mensaje"]).toEqual('El campo nombre y apellido son requeridos');
      })
  })
  it('create new user successfully', async () => {
    const res = await request(app)
      .post('/usuario')
      .send({
        "nombre": 'nombre1',
        "apellido": 'apellido1',
      })
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(false);
        expect(response.body["codigo"]).toEqual(200);
        expect(response.body["mensaje"]).toEqual('Usuario creado');
        expect(response.body["respuesta"]["nombre"]).toEqual('nombre1');
        expect(response.body["respuesta"]["apellido"]).toEqual('apellido1');
      })
  })
  it('create new user twice', async () => {
    const res = await request(app)
      .post('/usuario')
      .send({
        "nombre": 'nombre1',
        "apellido": 'apellido1',
      })
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(true);
        expect(response.body["mensaje"]).toEqual('El usuario ya fue creado previamente');
        expect(response.body["codigo"]).toEqual(503);
      })
  })
  it('get user just created', async () => {
    const res = await request(app)
      .get('/usuario')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(false);
        expect(response.body["codigo"]).toEqual(200);
        expect(response.body["mensaje"]).toEqual('respuesta del usuario');
        expect(response.body["respuesta"]["nombre"]).toEqual('nombre1');
        expect(response.body["respuesta"]["apellido"]).toEqual('apellido1');
      })
  })
  it('update user with invalid parameters', async () => {
    const res = await request(app)
      .put('/usuario')
      .send({
        "nombre2": 'nombre1',
        "apellido2": 'apellido1',
      })
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(true);
        expect(response.body["codigo"]).toEqual(502);
        expect(response.body["mensaje"]).toEqual('El campo nombre y apellido son requeridos');
      })
  })
  it('update user with successfully', async () => {
    const res = await request(app)
      .put('/usuario')
      .send({
        "nombre": 'nombre2',
        "apellido": 'apellido2',
      })
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(false);
        expect(response.body["codigo"]).toEqual(200);
        expect(response.body["mensaje"]).toEqual('Usuario actualizado');
        expect(response.body["respuesta"]["nombre"]).toEqual('nombre2');
        expect(response.body["respuesta"]["apellido"]).toEqual('apellido2');
      })
  })
  it('get user just updated', async () => {
    const res = await request(app)
      .get('/usuario')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(false);
        expect(response.body["codigo"]).toEqual(200);
        expect(response.body["mensaje"]).toEqual('respuesta del usuario');
        expect(response.body["respuesta"]["nombre"]).toEqual('nombre2');
        expect(response.body["respuesta"]["apellido"]).toEqual('apellido2');
      })
  })
  it('delete user just updated', async () => {
    const res = await request(app)
      .get('/usuario')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(false);
        expect(response.body["codigo"]).toEqual(200);
        expect(response.body["mensaje"]).toEqual('respuesta del usuario');
        expect(response.body["respuesta"]["nombre"]).toEqual('nombre2');
        expect(response.body["respuesta"]["apellido"]).toEqual('apellido2');
      })
  })
  it('delete user successfully', async () => {
    const res = await request(app)
      .delete('/usuario')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(false);
        expect(response.body["codigo"]).toEqual(200);
        expect(response.body["mensaje"]).toEqual('Usuario eliminado');
      })
  })
  it('get user but just removed', async () => {
    const res = await request(app)
      .get('/usuario')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(true);
        expect(response.body["codigo"]).toEqual(501);
        expect(response.body["mensaje"]).toEqual('El usuario no ha sido creado');
      })
  })
})



