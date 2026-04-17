const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categorias = await Category.find({ active: true });
    res.json({ status: 'ok', data: categorias });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const nuevaCat = new Category(req.body);
    await nuevaCat.save();
    res.status(201).json({ status: 'ok', data: nuevaCat });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
