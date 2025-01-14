const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Admin Oluşturma
exports.createAdmin = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const adminExists = await Admin.findOne({ email });
      if (adminExists) {
        return res.status(400).json({ message: 'Admin already exists' });
      }
  
      const newAdmin = new Admin({ username, email, password });
      await newAdmin.save();
  
      res.status(201).json({
        message: 'Admin created successfully',
        admin: {
          id: newAdmin._id,
          username: newAdmin.username,
          email: newAdmin.email,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Admin Silme
  exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;
  
    try {
      const admin = await Admin.findByIdAndDelete(id);
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
// JWT Oluşturma Fonksiyonu
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Admin Girişi
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
