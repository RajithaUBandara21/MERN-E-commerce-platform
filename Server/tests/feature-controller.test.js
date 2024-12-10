const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Feature = require('../../models/Feature');
const { addFeatureImage, getFeatureImages } = require('../../controllers/common/feature-controller');

const app = express();
app.use(express.json());
app.post('/addFeatureImage', addFeatureImage);
app.get('/getFeatureImages', getFeatureImages);

describe('Feature Controller', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1/mern_ecommerce_test`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('should add a feature image', async () => {
    const response = await request(app)
      .post('/addFeatureImage')
      .send({ image: 'test-image-url' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.image).toBe('test-image-url');
  });

  it('should get feature images', async () => {
    const response = await request(app).get('/getFeatureImages');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('dummy test', () => {
    expect(true).toBe(true);
  });
});