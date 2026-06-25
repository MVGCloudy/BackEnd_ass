require('dotenv').config();
const app = require('./app');
const db = require('./config/db');

const port = process.env.PORT || 5001;
const host = '0.0.0.0';

app.listen(port, host, async () => {
  console.log(`Server running on http://${host}:${port}`);

  try {
    await db.testConnection();
    console.log('MySQL connected');
  } catch (error) {
    console.error('MySQL connection failed:', error.message);
  }
});
