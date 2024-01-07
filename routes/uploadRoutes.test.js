const request = require('supertest');
const createApp = require('../index'); 
const knex = require('knex')(require('../knexfile'));

let app; 
let server;

beforeAll( async() => {
    app = createApp();
    server = app.listen();

});

afterAll(async () => {
server.close();
});

describe('GET /upload', () => {
  test('upload route respond with status 200', async () => {
    const app = createApp();
    const response = await request(app).get('/upload');

    expect(response.status).toBe(200);
  });

  test('It should respond with a contestant object', async () => {
    const app = createApp();
    const response = await request(app).get('/upload/42');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
  });
});

describe('POST /upload/vote/:actorId', () => {
  test('upload/vote route respond with status 200', async () => {
    const actorId = 42; 
    const response = await request(app)
      .post(`/upload/vote/${actorId}`)
      .send({ votes: 10 });

    expect(response.status).toBe(200);
  });
});

describe('GET /upload/:actorId', () => {
  test('upload/:actorId route respond with status 200', async () => {
    const actorId = 42; 
    const response = await request(app).get(`/upload/${actorId}`);

    expect(response.status).toBe(200);
  });
});
// 43 was deleted 
// describe('DELETE /upload/:actorId', () => {
//   test('upload/:actorId route respond with status 200', async () => {
//     const actorId = 43; 
//     const response = await request(app).delete(`/upload/${actorId}`);

//     expect(response.status).toBe(200);
//   });
// });