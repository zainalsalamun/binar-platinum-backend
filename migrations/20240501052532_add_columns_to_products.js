/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('products', function(table) {
      // Menambahkan kolom 'kategori'
      table.string('kategori');
  
      // Menambahkan kolom 'image'
      table.string('image');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('products', function(table) {
      // Menghapus kolom 'kategori'
      table.dropColumn('kategori');
  
      // Menghapus kolom 'image'
      table.dropColumn('image');
    });
  };
  

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
