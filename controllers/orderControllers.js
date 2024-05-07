const ordeModel = require('../models/orderModels');

async function getAllOrders (req, res)  {
  try {
    const orders = await ordeModel.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil order' });
  }
}

async function getOrderById(req, res) {
  const id = req.params.id;
  try {
    const order = await ordeModel.getOrderById(id);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addOrder(req, res) {
  const { id_product, qty, total } = req.body;
  try {
    const message = await ordeModel.addOrder(id_product, qty, total);
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateOrder(req, res) {
  const id = req.params.id;
  const { id_product, qty, total } = req.body;
  try {
    const message = await ordeModel.updateOrder(id, id_product, qty, total);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteOrder(req, res) {
  const id = req.params.id;
  try {
    const message = await ordeModel.deleteOrder(id);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder
}


