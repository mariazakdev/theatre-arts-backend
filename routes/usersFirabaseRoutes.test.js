const request = require('supertest');
const createApp = require('../index');

describe('GET /users', () => {
  test('users route respond with status 200', async () => {
    const app = createApp();
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);

  });
}); 

