const db = require("../db");

async function getAllOrders() {
  try {
    const orders = await db("orders").select("*");
    return orders;
  } catch (error) {
    throw new Error("Error fetching orders");
  }
}

async function getOrderById(id) {
  try {
    const order = await db("orders").where("id", id).select("*").first();
    return order;
  } catch (error) {
    throw new Error("Error fetching order by ID");
  }
}

async function deleteOrder(id) {
  try {
    await db("orders").where("id", id).del();
    return "Order deleted successfully";
  } catch (error) {
    throw new Error("Error deleting order");
  }
}

async function createOrder({ first_name, last_name, email, address, country, state, zip, name_on_card, card_number, expired, cvv, product_name, shipping_id, total_amount }) {
  try {
    const orderId = await db("orders").insert({
      first_name,
      last_name,
      email,
      address,
      country,
      state,
      zip,
      name_on_card,
      card_number,
      expired,
      cvv,
      product_name,
      shipping_id,
      total_amount
    });
  } catch (error) {
    throw new Error("Error creating order");
  }

}

async function updateOrder(id, { first_name, last_name, email, address, country, state, zip, name_on_card, card_number, expired, cvv, product_name, shipping_id, total_amount }) {
  try {
    await db("orders").where("id", id).update({
      first_name,
      last_name,
      email,
      address,
      country,
      state,
      zip,
      name_on_card,
      card_number,
      expired,
      cvv,
      product_name,
      shipping_id,
      total_amount
    });
  } catch (error) {
    throw new Error("Error updating order");
  }
}
module.exports = {
  getAllOrders,
  getOrderById
}