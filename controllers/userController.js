const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  // This creates a new user
  createUser: async function (req, res) {
    try {
      const { first_name, last_name, address, phone, email, password, role } =
        req.body;
      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        res.status(400).json({ message: "Email already in use." });
      }
      bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ message: "Error hashing password" });
        }
        const user = new User({
          first_name,
          last_name,
          address,
          phone,
          email,
          password: hashedPassword,
          role,
        });

        try {
          await user.save();
          res
            .status(201)
            .json({ message: "User Profile Created Successfully" });
        } catch (saveErr) {
          console.error("Error saving user:", saveErr);
          res.status(500).json({ message: "Error saving user" });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  },

  // This reads all the user
  getAllUsers: async function (req, res) {
    try {
      const users = await User.find().select("-password");
      res.json({ data: users });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // This fetch users by single id
  getUserById: async function (req, res) {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ data: user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // This updates the user  by id
  updateUser: async function (req, res) {
    try {
      const updates = req.body;
      delete updates.role;
      const users = await User.findByIdAndUpdate(req.params.id, updates, {
        new: true,
      });
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ data: users });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // This deletes a user by id
  deleteUser: async function (req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // The function handles the user login
  loginUser: async function (req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      bcrypt.compare(password, user.password, async (err, result) => {
        if (err) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        if (result) {
          res.json({
            _id: user._id,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
          });
        } else {
          return res.status(401).json({ message: "Invalid credentials" });
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
  adminLoginUser: async function (req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (user.role != 1 || !user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      bcrypt.compare(password, user.password, async (err, result) => {
        if (err) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        if (result) {
          res.json({
            _id: user._id,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
          });
        } else {
          return res.status(401).json({ message: "Invalid credentials" });
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
};
