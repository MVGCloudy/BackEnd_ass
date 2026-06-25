const db = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone, address, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, password, phone, address, 'user', 'active']
    );
    res.status(201).json({ success: true, id: result.insertId, message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT id, name, email, role, status FROM users WHERE email = ? AND password = ? LIMIT 1', [email, password]);
    if (!rows.length) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.profile = async (req, res) => {
  res.json({ success: true, data: req.user || null });
};
