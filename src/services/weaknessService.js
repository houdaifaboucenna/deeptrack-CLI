import db, { getQuizHistory, getUserStats, updateUserStats } from '../db.js';

export function identifyWeakTopics(threshold = 70) {
  const stmt = db.prepare(`
    SELECT 
      t.id,
      t.name,
      t.slug,
      COUNT(q.id) as attempts,
      AVG(q.score) as avg_score
    FROM topics t
    LEFT JOIN quizzes q ON t.id = q.topic_id AND q.completed = 1
    GROUP BY t.id
    HAVING AVG(q.score) IS NULL OR AVG(q.score) < ?
    ORDER BY avg_score ASC
  `);
  return stmt.all(threshold);
}

export function getTopicStats(topicId) {
  const stmt = db.prepare(`
    SELECT 
      t.id,
      t.name,
      t.slug,
      COUNT(q.id) as total_attempts,
      ROUND(AVG(q.score), 2) as avg_score,
      MAX(q.created_at) as last_attempted
    FROM topics t
    LEFT JOIN quizzes q ON t.id = q.topic_id AND q.completed = 1
    WHERE t.id = ?
    GROUP BY t.id
  `);
  return stmt.get(topicId);
}

export function suggestDailyChallenge() {
  const weakTopics = identifyWeakTopics(70);
  if (weakTopics.length === 0) {
    // If no weak topics, pick a random topic
    const allTopics = db.prepare(`
      SELECT id, name, slug FROM topics ORDER BY RANDOM() LIMIT 1
    `).all();
    return allTopics[0] || null;
  }
  return weakTopics[0];
}

export function calculateAverageScore(topicId) {
  const stmt = db.prepare(`
    SELECT AVG(score) as avg_score, COUNT(*) as total
    FROM quizzes
    WHERE topic_id = ? AND completed = 1
  `);
  return stmt.get(topicId);
}

export default {
  identifyWeakTopics,
  getTopicStats,
  suggestDailyChallenge,
  calculateAverageScore
};