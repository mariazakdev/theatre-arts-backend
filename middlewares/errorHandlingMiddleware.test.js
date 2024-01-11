
const errorHandlingMiddleware = require('./errorHandlingMiddleware');

describe('Error Handling Middleware', () => {
  it('should respond with 500 for internal server error', () => {
    const error = new Error('Simulated Internal Server Error');
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };
    const next = jest.fn();

    errorHandlingMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    expect(next).not.toHaveBeenCalled(); 
  });
});
