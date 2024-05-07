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
          nama_produk: 'Kursi', 
          harga: '100000', 
          deskripsi: 'Ini kursi untuk duduk yang sangat nyaman ', 
          nama_file: 'kursi', 
          kategori: 'kursi', 
          image: 'img/produst/kursi.jpg' 
        },
        { 
          nama_produk: 'Sikat', 
          harga: '150000', 
          deskripsi: 'Sikat untuk menggosok lantai', 
          nama_file: 'Sikat', 
          kategori: 'sikat', 
          image: 'img/prodict/sikat.jpg' 
        },
        // tambahkan data lainnya sesuai kebutuhan
      ]);
    });
};
