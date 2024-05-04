const productModel = require('../models/productModels');


async function getAllProducts(req, res) {
  try {
    const products = await productModel.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getProductById(req, res) {
  const id = req.params.id;
  try {
    const product = await productModel.getProductById(id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addProduct(req, res) {
  const { nama_produk, harga, deskripsi, nama_file, kategori, image } = req.body;
  try {
    const message = await productModel.addProduct(nama_produk, harga, deskripsi, nama_file, kategori, image);
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateProduct(req, res) {
  const id = req.params.id;
  const { nama_produk, harga, deskripsi, nama_file, kategori, image } = req.body;
  try {
    const message = await productModel.updateProduct(id, nama_produk, harga, deskripsi, nama_file, kategori, image);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteProduct(req, res) {
  const id = req.params.id;
  try {
    const message = await productModel.deleteProduct(id);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
