const db = require('../config/db');

exports.getProductReviews = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT reviews.*, users.name AS user_name
      FROM reviews
      LEFT JOIN users ON users.id = reviews.user_id
      WHERE reviews.product_id = ?
      ORDER BY reviews.id DESC
    `, [req.params.productId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM reviews ORDER BY id DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { user_id, product_id, rating, comment } = req.body;
    const [result] = await db.query('INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)', [user_id, product_id, rating, comment]);
    res.status(201).json({ success: true, id: result.insertId, message: 'Review created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await db.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
