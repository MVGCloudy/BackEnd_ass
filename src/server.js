require('dotenv').config();
const app = require('./app');
const db = require('./config/db');

const port = process.env.PORT || 5001;

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);

  try {
    await db.testConnection();
    console.log('MySQL connected');
  } catch (error) {
    console.error('MySQL connection failed:', error.message);
  }
});
