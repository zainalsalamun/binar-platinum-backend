const productModel = require('../models/productModels');
const multer = require('multer');


const getAllProducts = async (req, res) => {
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/products'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const upload = multer({ storage: storage });

async function addProduct(req, res) {
  upload.single('image')(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    const { nama_produk, harga, deskripsi, nama_file, kategori } = req.body;
    
    let fileName;
    if (req.file) {
      fileName = req.file.originalname;
      image = `img/products/${fileName}`;
    }
    
    try {
      const message = await productModel.addProduct(nama_produk, harga, deskripsi, nama_file, kategori, image);
      res.status(201).json({ message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
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
