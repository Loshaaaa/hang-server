const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

class Task {
  static async createTask({ userId, title, description, dueDate, priority, status }) {
    const query = `
      INSERT INTO tasks (user_id, title, description, due_date, priority, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [userId, title, description, dueDate, priority, status];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getTasksByUserId(userId) {
    const query = 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC';
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  static async updateTask(taskId, userId, updates) {
    const allowedUpdates = ['title', 'description', 'due_date', 'priority', 'status'];
    const updateFields = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .map(key => `${key} = $${allowedUpdates.indexOf(key) + 3}`)
      .join(', ');

    const query = `
      UPDATE tasks
      SET ${updateFields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    const values = [taskId, userId, ...Object.values(updates)];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async deleteTask(taskId, userId) {
    const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *';
    const { rows } = await pool.query(query, [taskId, userId]);
    return rows[0];
  }
}

module.exports = Task; 