const request = require('supertest');
const app = require('../index'); 

describe('GET /upload', () => {
    it('should return all contestants', async () => {
        const response = await request(app).get('/upload');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('contestants');
        expect(Array.isArray(response.body.contestants)).toBe(true);
    });
});
