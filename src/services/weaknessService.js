import db, { getQuizHistory, getUserStats, updateUserStats } from '../db.js';

export function identifyWeakTopics(threshold = 70) {
  const stmt = db.prepare(`
    SELECT 
      t.id,
      t.name,
      t.slug,
      COUNT(qr.id) as attempts,
      AVG(qr.score) as avg_score
    FROM topics t
    LEFT JOIN quizzes q ON t.id = q.topic_id
    LEFT JOIN quiz_responses qr ON q.id = qr.quiz_id
    GROUP BY t.id
    HAVING COUNT(qr.id) > 0 AND AVG(qr.score) < ?
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
      COUNT(qr.id) as total_attempts,
      ROUND(AVG(qr.score), 2) as avg_score,
      MAX(qr.timestamp) as last_attempted
    FROM topics t
    LEFT JOIN quizzes q ON t.id = q.topic_id
    LEFT JOIN quiz_responses qr ON q.id = qr.quiz_id
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
    SELECT AVG(qr.score) as avg_score, COUNT(qr.id) as total
    FROM quiz_responses qr
    JOIN quizzes q ON qr.quiz_id = q.id
    WHERE q.topic_id = ?
  `);
  return stmt.get(topicId);
}

export default {
  identifyWeakTopics,
  getTopicStats,
  suggestDailyChallenge,
  calculateAverageScore
};