/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('UserRoles', function(table) {
      table.integer('user_id').unsigned().notNullable();
      table.integer('role_id').unsigned().notNullable();
      table.foreign('user_id').references('id_user').inTable('Users');
      table.foreign('role_id').references('role_id').inTable('Role');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('UserRoles');
  };
  