const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust the path if necessary
let server;

beforeAll((done) => {
  server = app.listen(4000, () => {
    console.log('Test server running on port 4000');
    done();
  });
});

describe('GET /api/auth', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/api/auth');
    expect(res.statusCode).toEqual(200);
  });
});

describe('GET /api/shop/products', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/api/shop/products');
    expect(res.statusCode).toEqual(200);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await new Promise((resolve) => server.close(resolve));
  console.log('Test server closed');
});