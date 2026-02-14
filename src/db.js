import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../data.db');

const db = new Database(dbPath);

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER NOT NULL,
      questions_json TEXT NOT NULL,
      score REAL,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (topic_id) REFERENCES topics(id)
    );

    CREATE TABLE IF NOT EXISTS quiz_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER NOT NULL,
      answers_json TEXT NOT NULL,
      score REAL NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
    );

    CREATE TABLE IF NOT EXISTS user_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total_quizzes INTEGER DEFAULT 0,
      total_score REAL DEFAULT 0,
      streak_days INTEGER DEFAULT 0,
      last_quiz_date DATETIME,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Topic functions
export function addTopic(name, description = '') {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const stmt = db.prepare(
    'INSERT INTO topics (name, slug, description) VALUES (?, ?, ?)'
  );
  try {
    const result = stmt.run(name, slug, description);
    return result.lastInsertRowid;
  } catch (error) {
    throw new Error(`Topic "${name}" already exists`);
  }
}

export function getTopic(nameOrSlug) {
  const stmt = db.prepare(
    'SELECT * FROM topics WHERE name = ? OR slug = ?'
  );
  return stmt.get(nameOrSlug, nameOrSlug);
}

export function getAllTopics() {
  const stmt = db.prepare('SELECT * FROM topics ORDER BY created_at DESC');
  return stmt.all();
}

// Quiz functions
export function saveQuiz(topicId, questionsJson) {
  const stmt = db.prepare(
    'INSERT INTO quizzes (topic_id, questions_json) VALUES (?, ?)'
  );
  const result = stmt.run(topicId, JSON.stringify(questionsJson));
  return result.lastInsertRowid;
}

export function getQuiz(quizId) {
  const stmt = db.prepare('SELECT * FROM quizzes WHERE id = ?');
  const quiz = stmt.get(quizId);
  if (quiz) {
    quiz.questions_json = JSON.parse(quiz.questions_json);
  }
  return quiz;
}

export function submitQuizAnswer(quizId, answersJson, score) {
  const stmt = db.prepare(
    'INSERT INTO quiz_responses (quiz_id, answers_json, score) VALUES (?, ?, ?)'
  );
  stmt.run(quizId, JSON.stringify(answersJson), score);
  
  // Update quiz as completed
  const updateStmt = db.prepare('UPDATE quizzes SET score = ?, completed = 1 WHERE id = ?');
  updateStmt.run(score, quizId);
}

export function getQuizHistory(topicId, limit = 10) {
  const stmt = db.prepare(
    `SELECT q.*, t.name as topic_name 
     FROM quizzes q 
     JOIN topics t ON q.topic_id = t.id 
     WHERE q.topic_id = ? 
     ORDER BY q.created_at DESC 
     LIMIT ?`
  );
  return stmt.all(topicId, limit);
}

export function getQuizResponses(quizId) {
  const stmt = db.prepare('SELECT * FROM quiz_responses WHERE quiz_id = ? ORDER BY timestamp DESC');
  const responses = stmt.all(quizId);
  return responses.map(r => ({
    ...r,
    answers_json: JSON.parse(r.answers_json)
  }));
}

// User stats functions
export function initUserStats() {
  const stmt = db.prepare('INSERT OR IGNORE INTO user_stats (id) VALUES (1)');
  stmt.run();
}

export function updateUserStats(totalQuizzes, totalScore, streakDays, lastQuizDate) {
  const stmt = db.prepare(
    `UPDATE user_stats 
     SET total_quizzes = ?, total_score = ?, streak_days = ?, last_quiz_date = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = 1`
  );
  stmt.run(totalQuizzes, totalScore, streakDays, lastQuizDate);
}

export function getUserStats() {
  const stmt = db.prepare('SELECT * FROM user_stats WHERE id = 1');
  return stmt.get();
}

export default db;
