const categoryModel = require("../models/categoryModels");

async function getAllCategories(req, res) {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addCategory(req, res) {
  const { title, image_path } = req.body;
  try {
    const message = await categoryModel.addCategory(title, image_path);
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateCategory(req, res) {
  const id = req.params.id;
  const { title, image_path } = req.body;
  try {
    const message = await categoryModel.updateCategory(id, title, image_path);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteCategory(req, res) {
  const id = req.params.id;
  try {
    const message = await categoryModel.deleteCategory(id);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory
};
