const db = require('../config/db');

exports.getOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT orders.*, users.name AS user_name, users.email AS user_email
      FROM orders
      LEFT JOIN users ON users.id = orders.user_id
      ORDER BY orders.id DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ? LIMIT 1', [req.params.id]);
    if (!orders.length) return res.status(404).json({ success: false, message: 'Order not found' });
    const [items] = await db.query('SELECT order_items.*, products.name AS product_name FROM order_items LEFT JOIN products ON products.id = order_items.product_id WHERE order_id = ?', [req.params.id]);
    return res.json({ success: true, data: { ...orders[0], items } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { user_id, total, status, items } = req.body;
    const [result] = await db.query(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [user_id, total, status || 'pending']
    );
    if (Array.isArray(items)) {
      for (const item of items) {
        await db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [
          result.insertId,
          item.product_id,
          item.quantity,
          item.price,
        ]);
      }
    }
    res.status(201).json({ success: true, id: result.insertId, message: 'Order created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
