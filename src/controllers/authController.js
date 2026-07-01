const db = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, 'user']
    );
    res.status(201).json({ success: true, id: result.insertId, message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const account = (
      req.body.account ||
      req.body.phone ||
      ''
    ).toString().trim();
    const password = (req.body.password || '').toString();

    if (!account || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and password are required',
      });
    }

    const normalizedPhone = account.replace(/[^0-9]+/g, '');
    const [rows] = await db.query(
      `
        SELECT
          id,
          fullName,
          email,
          phone,
          profileImageUrl,
          address,
          isActive,
          createdAt,
          updatedAt
        FROM customers
        WHERE
          password = ?
          AND isActive = 1
          AND (
            phone = ?
            OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone, '+', ''), '-', ''), ' ', ''), '(', ''), ')', '') = ?
          )
        LIMIT 1
      `,
      [password, account, normalizedPhone]
    );

    if (!rows.length) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password. Please try again',
      });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.profile = async (req, res) => {
  res.json({ success: true, data: req.user || null });
};
