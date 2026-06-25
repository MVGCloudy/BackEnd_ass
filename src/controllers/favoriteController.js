const db = require('../config/db');

exports.getFavorites = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT favorites.*, products.name AS product_name, products.price AS product_price, products.imageUrl AS product_image
      FROM favorites
      LEFT JOIN products ON products.id = favorites.product_id
      ORDER BY favorites.id DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    const [result] = await db.query('INSERT INTO favorites (user_id, product_id) VALUES (?, ?)', [user_id, product_id]);
    res.status(201).json({ success: true, id: result.insertId, message: 'Favorite added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    await db.query('DELETE FROM favorites WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Favorite removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
