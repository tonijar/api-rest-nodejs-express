const request = require('supertest');
const app = require('../index');

describe('Test store, update, get and delete functinalities from user RESTful API', () => {
  it('get user but none created yet', async () => {
    await request(app)
      .get('/user')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(true);
        expect(response.body["code"]).toEqual(501);
        expect(response.body["message"]).toEqual('User not created');
      });
  });
  it('delete user but none created yet', async () => {
    await request(app)
      .delete('/user')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(true);
        expect(response.body["code"]).toEqual(501);
        expect(response.body["message"]).toEqual('User not created');
      });
  });
  it('create new user with invalid parameters', async () => {
    await request(app)
      .post('/user')
      .send({
        "name2": 'name1',
        "surname2": 'surname1',
      })
      .then((response) => {
        expect(response.statusCode).toEqual(400);
      });
  });
  it('create new user successfully', async () => {
    await request(app)
      .post('/user')
      .send({
        "name": 'name1',
        "surname": 'surname1',
      })
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(false);
        expect(response.body["code"]).toEqual(200);
        expect(response.body["message"]).toEqual('User created');
        expect(response.body["response"]["name"]).toEqual('name1');
        expect(response.body["response"]["surname"]).toEqual('surname1');
      });
  });
  it('create new user twice', async () => {
    await request(app)
      .post('/user')
      .send({
        "name": 'name1',
        "surname": 'surname1',
      })
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(true);
        expect(response.body["message"]).toEqual('User already created previously');
        expect(response.body["code"]).toEqual(503);
      });
  });
  it('get user just created', async () => {
    await request(app)
      .get('/user')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(false);
        expect(response.body["code"]).toEqual(200);
        expect(response.body["message"]).toEqual('User response');
        expect(response.body["response"]["name"]).toEqual('name1');
        expect(response.body["response"]["surname"]).toEqual('surname1');
      });
  });
  it('get entire user with partial response', async () => {
    await request(app)
      .get('/user?fields=error,code,message,response')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(false);
        expect(response.body["code"]).toEqual(200);
        expect(response.body["message"]).toEqual('User response');
        expect(response.body["response"]["name"]).toEqual('name1');
        expect(response.body["response"]["surname"]).toEqual('surname1');
      });
  });
  it('get only some user fields with partial response', async () => {
    await request(app)
      .get('/user?fields=error,code,response')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(false);
        expect(response.body["code"]).toEqual(200);
        expect(response.body["message"]).toEqual(undefined);
        expect(response.body["response"]["name"]).toEqual('name1');
        expect(response.body["response"]["surname"]).toEqual('surname1');
      });
  });
  it('update user with invalid parameters', async () => {
    await request(app)
      .put('/user')
      .send({
        "name2": 'name1',
        "surname2": 'surname1',
      })
      .then((response) => {
        expect(response.statusCode).toEqual(400);
      });
  });
  it('update user with successfully', async () => {
    await request(app)
      .put('/user')
      .send({
        "name": 'name2',
        "surname": 'surname2',
      })
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(false);
        expect(response.body["code"]).toEqual(200);
        expect(response.body["message"]).toEqual('User updated');
        expect(response.body["response"]["name"]).toEqual('name2');
        expect(response.body["response"]["surname"]).toEqual('surname2');
      });
  });
  it('get user just updated', async () => {
    await request(app)
      .get('/user')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(false);
        expect(response.body["code"]).toEqual(200);
        expect(response.body["message"]).toEqual('User response');
        expect(response.body["response"]["name"]).toEqual('name2');
        expect(response.body["response"]["surname"]).toEqual('surname2');
      });
  });
  it('delete user successfully', async () => {
    await request(app)
      .delete('/user')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(false);
        expect(response.body["code"]).toEqual(200);
        expect(response.body["message"]).toEqual('User deleted');
      });
  });
  it('get user but just removed', async () => {
    await request(app)
      .get('/user')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body["error"]).toEqual(true);
        expect(response.body["code"]).toEqual(501);
        expect(response.body["message"]).toEqual('User not created');
      });
  });
  it('access unknown path', async () => {
    await request(app)
      .get('/unknown_path')
      .then((response) => {
        expect(response.statusCode).toEqual(404);
        expect(response.body["error"]).toEqual(true);
        expect(response.body["code"]).toEqual(404);
        expect(response.body["message"]).toEqual('URL not found');
      });
  });
  it('access static content', async () => {
    await request(app)
      .get('/static/test.txt')
      .then((response) => {
        expect(response.statusCode).toEqual(200);
      });
  });
  it('access static unknown content', async () => {
    await request(app)
      .get('/static/unknown_file.txt')
      .then((response) => {
        expect(response.statusCode).toEqual(404);
      });
  });
});
