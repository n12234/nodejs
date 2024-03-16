const Product = require("../models/ProductModel");
const productValidator = require("../validations/product");

class ProductsController {
  // [GET] /products
  async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 4;
      // const products = await Product.find()
      const products = await Product.find({ student: res.locals.id }).populate(
        "category"
      )
      .skip((page - 1) * pageSize)
        .limit(parseInt(pageSize));
      res.json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [GET] /products/:id
  async getProductDetail(req, res) {
    try {
      const product = await Product.findOne({
        _id: req.params.id,
        student: res.locals.id,
      }).populate("category");
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProductsByCategory(req, res) {
    try {
      const products = await Product.find({ category: req.params.category });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve products" });
    }
  };

  // [POST] /product
  async createProduct(req, res) {
    try {
      // Bước 1: Validate email, password
      const { error } = productValidator.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({ errors });
      }
      // Valadiate rep.body
      const product = new Product({ ...req.body, student: res.locals.id });

      const saveProduct = await product.save();
      res.json({ message: "Add Product Successful", data: saveProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [PUT] /products/:id
  async updateProduct(req, res) {
    try {
      const product = await Product.updateOne({ _id: req.params.id }, req.body);
      res
        .status(200)
        .json({ message: "Update Product Successful", data: product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [DELETE] /products/:id
  async deleleProduct(req, res) {
    try {
      await Product.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Delete Product Successful" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ProductsController();
