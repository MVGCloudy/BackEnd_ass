const db = require('../config/db');

const tables = {
  banner_promos: {
    columns: ['id', 'title', 'imageUrl', 'url', 'displayOrder', 'isActive', 'createdAt', 'updatedAt'],
    writable: ['title', 'imageUrl', 'url', 'displayOrder', 'isActive'],
  },
  carts: {
    columns: ['id', 'user_id', 'product_id', 'quantity', 'created_at'],
    writable: ['user_id', 'product_id', 'quantity'],
  },
  categories: {
    columns: ['id', 'name', 'image', 'created_at'],
    writable: ['name', 'image'],
  },
  customers: {
    columns: ['id', 'fullName', 'email', 'phone', 'password', 'profileImageUrl', 'address', 'isActive', 'createdAt', 'updatedAt'],
    writable: ['fullName', 'email', 'phone', 'password', 'profileImageUrl', 'address', 'isActive'],
  },
  favorites: {
    columns: ['id', 'user_id', 'product_id', 'created_at'],
    writable: ['user_id', 'product_id'],
  },
  order_items: {
    columns: ['id', 'order_id', 'product_id', 'quantity', 'price'],
    writable: ['order_id', 'product_id', 'quantity', 'price'],
  },
  orders: {
    columns: ['id', 'user_id', 'total', 'status', 'created_at'],
    writable: ['user_id', 'total', 'status'],
  },
  products: {
    columns: ['id', 'category_id', 'name', 'description', 'price', 'imageUrl', 'stock', 'created_at'],
    writable: ['category_id', 'name', 'description', 'price', 'imageUrl', 'stock'],
  },
  reviews: {
    columns: ['id', 'user_id', 'product_id', 'rating', 'comment', 'created_at'],
    writable: ['user_id', 'product_id', 'rating', 'comment'],
  },
  users: {
    columns: ['id', 'name', 'email', 'password', 'role', 'created_at'],
    writable: ['name', 'email', 'password', 'role'],
  },
};

const getTableConfig = (tableName) => tables[tableName];

const pickWritableFields = (tableConfig, body) => {
  const fields = tableConfig.writable.filter((column) => Object.prototype.hasOwnProperty.call(body, column));
  return {
    fields,
    values: fields.map((field) => body[field]),
  };
};

exports.getTables = (req, res) => {
  res.json({ success: true, data: Object.keys(tables) });
};

exports.getRows = async (req, res) => {
  try {
    const tableConfig = getTableConfig(req.params.table);
    if (!tableConfig) return res.status(404).json({ success: false, message: 'Table not found' });

    const [rows] = await db.query('SELECT ?? FROM ?? ORDER BY id DESC', [tableConfig.columns, req.params.table]);
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRowById = async (req, res) => {
  try {
    const tableConfig = getTableConfig(req.params.table);
    if (!tableConfig) return res.status(404).json({ success: false, message: 'Table not found' });

    const [rows] = await db.query('SELECT ?? FROM ?? WHERE id = ? LIMIT 1', [
      tableConfig.columns,
      req.params.table,
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Record not found' });
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createRow = async (req, res) => {
  try {
    const tableConfig = getTableConfig(req.params.table);
    if (!tableConfig) return res.status(404).json({ success: false, message: 'Table not found' });

    const { fields, values } = pickWritableFields(tableConfig, req.body);
    if (!fields.length) return res.status(400).json({ success: false, message: 'No valid fields provided' });

    const placeholders = fields.map(() => '?').join(', ');
    const sql = `INSERT INTO ?? (${fields.map(() => '??').join(', ')}) VALUES (${placeholders})`;
    const [result] = await db.query(sql, [req.params.table, ...fields, ...values]);

    return res.status(201).json({ success: true, id: result.insertId, message: 'Record created' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRow = async (req, res) => {
  try {
    const tableConfig = getTableConfig(req.params.table);
    if (!tableConfig) return res.status(404).json({ success: false, message: 'Table not found' });

    const { fields, values } = pickWritableFields(tableConfig, req.body);
    if (!fields.length) return res.status(400).json({ success: false, message: 'No valid fields provided' });

    const assignments = fields.map(() => '?? = ?').join(', ');
    const assignmentParams = fields.flatMap((field, index) => [field, values[index]]);
    const [result] = await db.query(`UPDATE ?? SET ${assignments} WHERE id = ?`, [
      req.params.table,
      ...assignmentParams,
      req.params.id,
    ]);

    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Record not found' });
    return res.json({ success: true, message: 'Record updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteRow = async (req, res) => {
  try {
    const tableConfig = getTableConfig(req.params.table);
    if (!tableConfig) return res.status(404).json({ success: false, message: 'Table not found' });

    const [result] = await db.query('DELETE FROM ?? WHERE id = ?', [req.params.table, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Record not found' });
    return res.json({ success: true, message: 'Record deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
