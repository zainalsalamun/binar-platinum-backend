const db = require("./db");

async function getAllProducts() {
  try {
    const products = await db("products").select("*");
    return products;
  } catch (error) {
    throw new Error("Error fetching products");
  }
}

async function getProductById(id) {
  try {
    const product = await db("products").where("id", id).first();
    return product;
  } catch (error) {
    throw new Error("Error fetching product by ID");
  }
}

async function addProduct(nama_produk, harga, deskripsi, nama_file, kategori, image) {
  try {
    await db("products").insert({
      'nama_produk': nama_produk,
      'harga': harga,
      'deskripsi': deskripsi,
      'nama_file': nama_file,
      'kategori': kategori,
      'image': image
    });
    return "Product added successfully";
  } catch (error) {
    throw new Error("Error adding product");
  }
}

async function updateProduct(id, nama_produk, harga, deskripsi, nama_file, kategori, image) {
  try {
    await db("products").where('id', id).update({
      'nama_produk': nama_produk,
      'harga': harga,
      'deskripsi': deskripsi,
      'nama_file': nama_file,
      'kategori': kategori,
      'image': image
    });
    return "Product updated successfully";
  } catch (error) {
    throw new Error("Error updating product");
  }
}

async function deleteProduct(id) {
  try {
    await db("products").where("id", id).del();
    return "Product deleted successfully";
  } catch (error) {
    throw new Error("Error deleting product");
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
