const Category = require("../models/Category");

module.exports = {
  // This creates a new category
  createCategory: async function (req, res) {
    try {
      const category = new Category(req.body);
      await category.save();
      res.status(201).json({ message: "Category Created Successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // This reads all the categories
  getAllCategory: async function (req, res) {
    try {
      const categories = await Category.find();
      res.json({ data: categories });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // This fetch category by name
  getCategoryByName: async function (req, res) {
    try {
      const category = await Category.findById(req.params.name);
      if (!category)
        return res.status(404).json({ message: "Category not found" });
      res.json({ data: category });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // This updates the category  by id
  updateCategory: async function (req, res) {
    try {
      const updates = req.body;
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        updates,
        {
          new: true,
        }
      );
      if (!category)
        return res.status(404).json({ message: "Category not found" });
      res.json({ message: "Category updated successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // This deletes a category by id
  deleteCategory: async function (req, res) {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category)
        return res.status(404).json({ message: "Category not found" });
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
