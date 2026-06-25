const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const [[users]] = await db.query('SELECT COUNT(*) AS total FROM users');
    const [[products]] = await db.query('SELECT COUNT(*) AS total FROM products');
    const [[orders]] = await db.query('SELECT COUNT(*) AS total FROM orders');
    const [[sales]] = await db.query('SELECT COALESCE(SUM(total), 0) AS total FROM orders WHERE status = "completed"');
    res.json({
      success: true,
      data: {
        users: users.total,
        products: products.total,
        orders: orders.total,
        sales: sales.total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const [ordersByStatus] = await db.query('SELECT status, COUNT(*) AS total FROM orders GROUP BY status');
    const [topProducts] = await db.query(`
      SELECT products.id, products.name, SUM(order_items.quantity) AS sold
      FROM order_items
      LEFT JOIN products ON products.id = order_items.product_id
      GROUP BY products.id, products.name
      ORDER BY sold DESC
      LIMIT 10
    `);
    res.json({ success: true, data: { ordersByStatus, topProducts } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
