
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerUser, loginUser, logoutUser, authMiddleware } = require('../controllers/auth/auth-controller');
const User = require('../models/User');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.post('/register', registerUser);
app.post('/login', loginUser);
app.post('/logout', logoutUser);
app.get('/protected', authMiddleware, (req, res) => res.json({ success: true }));

jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.prototype.save = jest.fn().mockResolvedValue({});

      const res = await request(app)
        .post('/register')
        .send({ userName: 'testuser', email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Registration successful');
    });

    it('should not register a user with an existing email', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      const res = await request(app)
        .post('/register')
        .send({ userName: 'testuser', email: 'test@example.com', password: 'password123' });

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User Already exists with the same email! Please try again');
    });
  });

  describe('loginUser', () => {
    it('should login a user with correct credentials', async () => {
      const mockUser = { _id: '1', email: 'test@example.com', password: 'hashedPassword', role: 'user', userName: 'testuser' };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      const res = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Logged in successfully');
      expect(res.body.user.email).toBe(mockUser.email);
    });

    it('should not login a user with incorrect password', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Incorrect password! Please try again');
    });

    it('should not login a non-existent user', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' });

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("User doesn't exists! Please register first");
    });
  });

  describe('logoutUser', () => {
    it('should logout a user', async () => {
      const res = await request(app).post('/logout');

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Logged out successfully!');
    });
  });

  describe('authMiddleware', () => {
    it('should allow access to protected route with valid token', async () => {
      jwt.verify.mockReturnValue({ id: '1', email: 'test@example.com' });

      const res = await request(app)
        .get('/protected')
        .set('Cookie', ['token=validtoken']);

      expect(res.body.success).toBe(true);
    });

    it('should deny access to protected route with invalid token', async () => {
      jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

      const res = await request(app)
        .get('/protected')
        .set('Cookie', ['token=invalidtoken']);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Unauthorised user!');
    });
  });
});