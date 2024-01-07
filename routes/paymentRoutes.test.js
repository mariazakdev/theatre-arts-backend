const request = require('supertest');
const createApp = require('../index');
const { route } = require('./usersFirabaseRoutes');

describe('GET /payment', () => {
  test('payment route respond with status 200', async () => {
    const app = createApp();
    const response = await request(app).get('/payment');

    expect(response.status).toBe(200);

  });
});

describe('POST /payment', () => {
  test('payment route respond with status 200', async () => {
    const app = createApp();
    const response = await request(app)
      .post('/payment')
      .send( {
        "currency": "cad",
        "description": "Contest Entry Fee",
        "return_url": "http://localhost:3000/contestant/upload",
        "confirmation_method": "manual",
        "amount": "250",
        "confirm": "true"
      } );

    expect(response.status).toBe(200);
  });
});