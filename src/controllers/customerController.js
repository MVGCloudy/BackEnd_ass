const db = require('../config/db');

exports.getCustomers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, fullName, email, phone, profileImageUrl, address, isActive, createdAt, updatedAt
      FROM customers
      ORDER BY id DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, fullName, email, phone, profileImageUrl, address, isActive, createdAt, updatedAt FROM customers WHERE id = ? LIMIT 1',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Customer not found' });
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
exports.createCustomer = async (req, res) => {
  try {
    const { fullName, email, phone, password, profileImageUrl, address, isActive } = req.body;
    const [result] = await db.query(
      'INSERT INTO customers (fullName, email, phone, password, profileImageUrl, address, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [fullName, email, phone, password, profileImageUrl, address, isActive ?? 1]
    );
    const newCustomerId = result.insertId;
    const [newCustomerRows] = await db.query(
      'SELECT id, fullName, email, phone, profileImageUrl, address, isActive, createdAt, updatedAt FROM customers WHERE id = ? LIMIT 1',
      [newCustomerId]
    );
    return res.status(201).json({ success: true, data: newCustomerRows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
