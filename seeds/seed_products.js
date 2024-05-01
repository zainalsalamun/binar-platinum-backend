/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        { 
          nama_produk: 'Produk 1', 
          harga: '100000', 
          deskripsi: 'Deskripsi produk 1', 
          nama_file: 'file_produk_1', 
          kategori: 'Kategori 1', 
          image: 'image_produk_1.jpg' 
        },
        { 
          nama_produk: 'Produk 2', 
          harga: '150000', 
          deskripsi: 'Deskripsi produk 2', 
          nama_file: 'file_produk_2', 
          kategori: 'Kategori 2', 
          image: 'image_produk_2.jpg' 
        },
        // tambahkan data lainnya sesuai kebutuhan
      ]);
    });
};
