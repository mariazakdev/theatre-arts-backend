const request = require('supertest');
const createApp = require('../index');

describe('GET /dashboard', () => {
  test('dashboard route respond with status 200', async () => {
    const app = createApp();
    const response = await request(app).get('/dashboard');

    expect(response.status).toBe(200);

  });
});