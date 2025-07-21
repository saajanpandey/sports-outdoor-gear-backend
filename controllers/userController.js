const User = require("../models/User");

module.exports = {
  // This creates a new user
  createUser: async function (req, res) {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ message: "User Profile Created Successfully" });
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

      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
};
