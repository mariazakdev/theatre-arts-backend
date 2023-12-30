const request = require('supertest');
const createApp = require('../index');
const { describe } = require('node:test');

describe('GET /votes', () => {
  test('votes route respond with status 200', async () => {
    const app = createApp();
    const response = await request(app).get('/votes');

    expect(response.status).toBe(200);

  });
});