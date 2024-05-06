exports.seed = function(knex) {
 
  return knex('orders').del()
    .then(function () {
      return knex('orders').insert([
        { 
          first_name: 'John', 
          last_name: 'Doe', 
          email: 'john@example.com', 
          address: '123 Main St', 
          country: 'USA', 
          state: 'CA', 
          zip: '90001', 
          name_on_card: 'John Doe', 
          card_number: '1234567890123456', 
          expired: '12/25', 
          cvv: '123', 
          product_name: 'Product 1', 
          shipping_id: 1, 
          total_amount: 100.00 
        },
        // Add more seed data here if needed
      ]);
    });
};
