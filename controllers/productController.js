const Product = require("../models/Product");
const Category = require("../models/Category");
const path = require("path");
const fs = require("fs");

exports.createProduct = async (req, res) => {
  try {
    const {
      product_name,
      product_description,
      price,
      is_featured,
      category,
      brand_name,
    } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Please Select The Category!!" });
    }

    const checkCategory = await Category.findById({
      _id: category,
    });

    if (!checkCategory) {
      return res.status(404).json({ message: "Category Not Found!" });
    }

    const image = req.file
      ? `/uploads/products/images/${req.file.filename}`
      : null;

    if (!image) {
      return res.status(404).json({ message: "Please Select an Image!!" });
    }

    const newProduct = new Product({
      product_name,
      product_description,
      price,
      is_featured,
      category,
      brand_name,
      image,
    });

    const savedProduct = await newProduct.save();
    res
      .status(201)
      .json({ message: "Product Created Successfully", data: savedProduct });
  } catch (error) {
    res.status(400).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");

    const productsWithImageUrl = products.map((product) => {
      const productObj = product.toObject();

      productObj.image = `http://localhost:3000${product.image}`;

      return productObj;
    });
    res.json(productsWithImageUrl);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });
    const imageUrl = `http://localhost:3000${product.image}`;

    const productObj = product.toObject();
    productObj.image = imageUrl;

    res.json({ data: productObj });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching product", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const {
      product_name,
      product_description,
      price,
      is_featured,
      category,
      brand_name,
    } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Please Select The Category!!" });
    }

    const checkCategory = await Category.findById({
      _id: category,
    });

    if (!checkCategory) {
      return res.status(404).json({ message: "Category Not Found!" });
    }

    const image = req.file
      ? `/uploads/products/images/${req.file.filename}`
      : undefined;

    const updatedData = {
      product_name,
      product_description,
      price,
      is_featured,
      category,
      brand_name,
    };

    if (image) updatedData.image = image;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product Updated", data: updatedProduct });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating product", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const item = await Product.findByIdAndDelete(req.params.id);
    if (item.image) {
      const url = __dirname;
      const clean = url.replace("/controllers", "");
      const imagePath = path.join(clean, item.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        }
      });
    }
    if (!item) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to delete product", error: error.message });
  }
};
