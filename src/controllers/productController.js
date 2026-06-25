const db = require('../config/db');

exports.getProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.id DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = ?
      LIMIT 1
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { category_id, name, description, price, image, stock, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO products (category_id, name, description, price, image, stock, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [category_id, name, description, price, image, stock || 0, status || 'active']
    );
    res.status(201).json({ success: true, id: result.insertId, message: 'Product created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { category_id, name, description, price, image, stock, status } = req.body;
    await db.query(
      'UPDATE products SET category_id = ?, name = ?, description = ?, price = ?, image = ?, stock = ?, status = ? WHERE id = ?',
      [category_id, name, description, price, image, stock, status, req.params.id]
    );
    res.json({ success: true, message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
