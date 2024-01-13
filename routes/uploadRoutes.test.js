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

describe('GET /contestants', () => {
  test('upload route respond with status 200', async () => {
    const app = createApp();
    const response = await request(app).get('/contestants');

    expect(response.status).toBe(200);
  });

  test('It should respond with a contestant object', async () => {
    const app = createApp();
    const response = await request(app).get('/contestants/20');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
  });
});

describe('POST /contestants/vote/:actorId', () => {
  test('contestants/vote route respond with status 200', async () => {
    const actorId = 20; 
    const response = await request(app)
      .post(`/contestants/vote/${actorId}`)
      .send({ votes: 10 });

    expect(response.status).toBe(200);
  });
});

describe('GET /contestants/:actorId', () => {
  test('contestants/:actorId route respond with status 200', async () => {
    const actorId = 20; 
    const response = await request(app).get(`/contestants/${actorId}`);

    expect(response.status).toBe(200);
  });
});

// 43 was deleted // TEST WORKED
// describe('DELETE /contestants/:actorId', () => {
//   test('upload/:actorId route respond with status 200', async () => {
//     const actorId = 43; 
//     const response = await request(app).delete(`/upload/${actorId}`);

//     expect(response.status).toBe(200);
//   });
// });

describe('Negative Scenarios for Voting', () => {
  test('should respond with 400 for invalid votes parameter', async () => {
    const actorId = 720;
    const response = await request(app)
      .post(`/contestants/vote/${actorId}`)
      .send({ votes: 'invalid_votes' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('should respond with 400 for negative votes parameter', async () => {
    const actorId = 20;
    const response = await request(app)
      .post(`/contestants/vote/${actorId}`)
      .send({ votes: -5 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('should respond with 400 for missing votes parameter', async () => {
    const actorId = 20;
    const response = await request(app)
      .post(`/contestants/vote/${actorId}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});


describe('Testing Update with Invalid Actor ID', () => {


  test('should respond with 404 for non-existent actor ID in update route', async () => {
    const actorId = 999;
    const response = await request(app)
      .post(`/contestants/${actorId}`)
      .send({ videoUrl: 'new_video_url' });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
});
describe('Testing Get with Invalid Actor ID', () => {
  test('should respond with 404 for non-existent actor ID in get route', async () => {
    const actorId = 999;
    const response = await request(app).get(`/contestants/${actorId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
});

