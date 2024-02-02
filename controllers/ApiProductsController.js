const Product = require("../models/ProductModel");
const productValidator = require("../validations/product");

class ApiProductsController {
  // [GET] /products
  async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 4;
      const category = req.query.category || '';
      const search = req.query.search || '';

      const filter = {};
      if (category) filter.category = category;
      if (search) filter.title = { $regex: new RegExp(search), $options: "i" };

      const products = await Product.find(filter)
        .skip((page - 1) * pageSize)
        .limit(parseInt(pageSize));
        const totalProducts = await Product.countDocuments(filter);

        res.json({ totalProducts, products });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async searchProduct(req, res) {
    const { keyword } = req.query;

    try {
      const regex = new RegExp(keyword, "i");
      const products = await Product.find({
        $or: [{ title: regex }, { description: regex }],
      });

      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Không tồn tại từ khoá này" });
    }
  }

  // [GET] /products/:id
  async getProductDetail(req, res) {
    try {
      const product = await Product.findById({ _id: req.params.id }).populate(
        "category"
      );
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [POST] /product
  async createProduct(req, res) {
    try {
      // Bước 1: Validate email, password
      const { error } = productValidator.validate(req.body, {
        abortEarly: false,
      });

      // if (error) {
      //   const errors = error.details.map((err) => err.message);
      //   return res.status(400).json({ errors });
      // }
      // Valadiate rep.body
      const product = new Product({ ...req.body, student: null });

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

module.exports = new ApiProductsController();
