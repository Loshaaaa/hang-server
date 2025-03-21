const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

class User {
  static async createUser({ appleId, email, name }) {
    const query = `
      INSERT INTO users (apple_id, email, name)
      VALUES ($1, $2, $3)
      RETURNING id, apple_id, email, name, created_at
    `;
    const values = [appleId, email, name];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByAppleId(appleId) {
    const query = 'SELECT * FROM users WHERE apple_id = $1';
    const { rows } = await pool.query(query, [appleId]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static generateToken(user) {
    return jwt.sign(
      { id: user.id, appleId: user.apple_id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
  }
}

module.exports = User; 