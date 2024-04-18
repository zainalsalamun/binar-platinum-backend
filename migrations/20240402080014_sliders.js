exports.up = function (knex) {
    return knex.schema.createTable("sliders", function (table) {
      table.increments("id").primary();
      table.string("gambar_slider").notNullable();
      table.string("link_slider");
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("sliders");
  };
  