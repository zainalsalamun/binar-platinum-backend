/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Users', function(table) {
      table.increments('id_user').primary();
      table.string('username').notNullable();
      table.string('password').notNullable(); // Kolom untuk kata sandi terenkripsi
      table.string('email').notNullable();
      table.date('tgl_lahir').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('Users');
  };
  
