const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

class Task {
  static async createTask({ userId, title, flagged = false, status = 'todo' }) {
    const query = `
      INSERT INTO tasks (user_id, title, flagged, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [userId, title, flagged, status];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async createExampleTasks(userId) {
    const exampleTasks = [
      { title: 'Welcome to Hang! 👋', flagged: false, status: 'todo' },
      { title: 'Try marking this task as done', flagged: false, status: 'todo' },
      { title: 'Important task (flagged)', flagged: true, status: 'todo' }
    ];

    const tasks = [];
    for (const task of exampleTasks) {
      const newTask = await this.createTask({
        userId,
        ...task
      });
      tasks.push(newTask);
    }

    return tasks;
  }

  static async getTasksByUserId(userId) {
    const query = 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC';
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  static async updateTask(taskId, userId, updates) {
    const allowedUpdates = ['title', 'flagged', 'status'];
    const updateFields = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .map(key => `${key} = $${allowedUpdates.indexOf(key) + 3}`)
      .join(', ');

    const query = `
      UPDATE tasks
      SET ${updateFields}
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