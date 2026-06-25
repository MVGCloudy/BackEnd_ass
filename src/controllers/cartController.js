const db = require('../config/db');

exports.getCart = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT carts.*, products.name AS product_name, products.price AS product_price, products.image AS product_image
      FROM carts
      LEFT JOIN products ON products.id = carts.product_id
      ORDER BY carts.id DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    const [result] = await db.query('INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)', [user_id, product_id, quantity || 1]);
    res.status(201).json({ success: true, id: result.insertId, message: 'Added to cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    await db.query('UPDATE carts SET quantity = ? WHERE id = ?', [req.body.quantity, req.params.id]);
    res.json({ success: true, message: 'Cart item updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    await db.query('DELETE FROM carts WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Cart item removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
