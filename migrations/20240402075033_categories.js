exports.up = function (knex) {
    return knex.schema.createTable("categories", function (table) {
      table.increments("id").primary();
      table.string("title").notNullable();
      table.string("image_path").notNullable();
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("categories");
  };
  