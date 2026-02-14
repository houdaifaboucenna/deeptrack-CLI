import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../data.db');

const db = new Database(dbPath);

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export function addUser(name, email) {
  const stmt = db.prepare(
    'INSERT INTO users (name, email) VALUES (?, ?)'
  );
  const result = stmt.run(name, email);
  return result.lastInsertRowid;
}

export function getUsers() {
  const stmt = db.prepare('SELECT * FROM users');
  return stmt.all();
}

export function deleteUser(id) {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  stmt.run(id);
}

export default db;
