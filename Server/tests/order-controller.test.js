
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { getAllOrdersOfAllUsers, getOrderDetailsForAdmin, updateOrderStatus } = require('../controllers/admin/order-controller');
const Order = require('../models/Order');

const app = express();
app.use(express.json());
app.get('/orders', getAllOrdersOfAllUsers);
app.get('/orders/:id', getOrderDetailsForAdmin);
app.put('/orders/:id', updateOrderStatus);

jest.mock('../models/Order');

describe('Order Controller', () => {
  describe('getAllOrdersOfAllUsers', () => {
    it('should return all orders', async () => {
      Order.find.mockResolvedValue([{ _id: '1', orderStatus: 'Pending' }]);
      const res = await request(app).get('/orders');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });

    it('should return 404 if no orders found', async () => {
      Order.find.mockResolvedValue([]);
      const res = await request(app).get('/orders');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('No orders found!');
    });
  });

  describe('getOrderDetailsForAdmin', () => {
    it('should return order details', async () => {
      Order.findById.mockResolvedValue({ _id: '1', orderStatus: 'Pending' });
      const res = await request(app).get('/orders/1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe('1');
    });

    it('should return 404 if order not found', async () => {
      Order.findById.mockResolvedValue(null);
      const res = await request(app).get('/orders/1');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Order not found!');
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      Order.findById.mockResolvedValue({ _id: '1', orderStatus: 'Pending' });
      Order.findByIdAndUpdate.mockResolvedValue({ _id: '1', orderStatus: 'Shipped' });
      const res = await request(app).put('/orders/1').send({ orderStatus: 'Shipped' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Order status is updated successfully!');
    });

    it('should return 404 if order not found', async () => {
      Order.findById.mockResolvedValue(null);
      const res = await request(app).put('/orders/1').send({ orderStatus: 'Shipped' });
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Order not found!');
    });
  });
});