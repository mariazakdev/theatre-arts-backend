const request = require('supertest');
const createApp = require('../index');

describe('GET /payment', () => {
  test('payment route respond with status 200', async () => {
    const app = createApp();
    const response = await request(app).get('/payment');

    expect(response.status).toBe(200);

  });
});