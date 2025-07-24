const Category = require("../models/Category");

module.exports = {
  // This creates a new category
  createCategory: async function (req, res) {
    try {
      const { name } = req.body;
      const image = req.file
        ? `/uploads/category/images/${req.file.filename}`
        : null;

      const category = new Category({ name, image });
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
      const categoriesWithImageUrl = categories.map((category) => {
        const categoryObj = category.toObject();

        category.image = `http://localhost:3000${category.image}`;

        return categoryObj;
      });

      res.json(categoriesWithImageUrl);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // This fetch category by name
  getCategoryByName: async function (req, res) {
    try {
      const category = await Category.findById(req.params.name);
      if (!category)
        return res.status(404).json({ message: "Category Not Found" });
      const imageUrl = `http://localhost:3000${category.image}`;

      const categoryObj = category.toObject();
      categoryObj.image = imageUrl;

      res.json({ data: categoryObj });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // This updates the category  by id
  updateCategory: async function (req, res) {
    try {
      const { name } = req.body;

      const image = req.file
        ? `/uploads/category/images/${req.file.filename}`
        : undefined;

      const updatedData = {
        name,
      };

      if (image) {
        updatedData.image = image;
      }

      const updatedProduct = await Category.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Category Not Found" });
      }

      res.status(201).json({ message: "Category Updated Successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // This deletes a category by id
  deleteCategory: async function (req, res) {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (category.image) {
        const url = __dirname;
        const clean = url.replace("/controllers", "");
        const imagePath = path.join(clean, category.image);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Failed to delete image:", err);
          }
        });
      }
      if (!category)
        return res.status(404).json({ message: "Category not found" });
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
