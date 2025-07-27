const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const productController = require("../controllers/productController");

const router = express.Router();

// Create uploads folder if not exist
const dir = "./uploads/products/images";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
});

// Routes
router.post("/", upload.single("image"), productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", upload.single("image"), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

router.get("/category/:category", productController.getProductByCategoryName);

module.exports = router;
