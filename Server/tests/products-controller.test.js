const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const productsController = require("../controllers/admin/products-controller");

const app = express();
app.use(express.json());

const router = express.Router();
router.post("/", productsController.addProduct);
router.get("/", productsController.fetchAllProducts);
router.put("/:id", productsController.editProduct);
router.delete("/:id", productsController.deleteProduct);

app.use("/products", router);

describe("Products Controller", () => {
  beforeAll(async () => {
    // Connect to a test database
    const url = `mongodb://127.0.0.1/products_test_db`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    // Disconnect from the test database
    await mongoose.connection.close();
  });

  describe("POST /products", () => {
    it("should add a new product", async () => {
      const newProduct = {
        image: "image_url",
        title: "Test Product",
        description: "Test Description",
        category: "Test Category",
        brand: "Test Brand",
        price: 100,
        salePrice: 80,
        totalStock: 50,
        averageReview: 4.5,
      };

      const response = await request(app).post("/products").send(newProduct);
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(newProduct.title);
    });
  });

  describe("GET /products", () => {
    it("should fetch all products", async () => {
      const response = await request(app).get("/products");
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("PUT /products/:id", () => {
    it("should edit a product", async () => {
      const product = new Product({
        image: "image_url",
        title: "Test Product",
        description: "Test Description",
        category: "Test Category",
        brand: "Test Brand",
        price: 100,
        salePrice: 80,
        totalStock: 50,
        averageReview: 4.5,
      });
      await product.save();

      const updatedProduct = {
        title: "Updated Product",
      };

      const response = await request(app).put(`/products/${product._id}`).send(updatedProduct);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updatedProduct.title);
    });
  });

  describe("DELETE /products/:id", () => {
    it("should delete a product", async () => {
      const product = new Product({
        image: "image_url",
        title: "Test Product",
        description: "Test Description",
        category: "Test Category",
        brand: "Test Brand",
        price: 100,
        salePrice: 80,
        totalStock: 50,
        averageReview: 4.5,
      });
      await product.save();

      const response = await request(app).delete(`/products/${product._id}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);}