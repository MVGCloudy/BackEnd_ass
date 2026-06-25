const db = require('../config/db');

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, phone, address, avatar, role, status, created_at, updated_at FROM users ORDER BY id DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, phone, address, avatar, role, status, created_at, updated_at FROM users WHERE id = ? LIMIT 1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, avatar, role, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone, address, avatar, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, password, phone, address, avatar, role || 'user', status || 'active']
    );
    res.status(201).json({ success: true, id: result.insertId, message: 'User created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, address, avatar, role, status } = req.body;
    await db.query(
      'UPDATE users SET name = ?, email = ?, phone = ?, address = ?, avatar = ?, role = ?, status = ? WHERE id = ?',
      [name, email, phone, address, avatar, role, status, req.params.id]
    );
    res.json({ success: true, message: 'User updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
