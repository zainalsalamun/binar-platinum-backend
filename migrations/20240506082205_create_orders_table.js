exports.up = function(knex) {
    return knex.schema.createTable('orders', function(table) {
      table.increments('id').primary();
      table.string('first_name');
      table.string('last_name');
      table.string('email');
      table.string('address');
      table.string('country');
      table.string('state');
      table.string('zip');
      table.string('name_on_card');
      table.string('card_number');
      table.string('expired');
      table.string('cvv');
      table.string('product_name');
      table.integer('shipping_id');
      table.decimal('total_amount');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('orders');
  };
  