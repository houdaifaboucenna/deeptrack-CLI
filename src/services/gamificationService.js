import db, { getUserStats, updateUserStats } from '../db.js';

export function calculateStreak() {
  const stats = getUserStats();
  if (!stats || !stats.last_quiz_date) return 0;

  const lastDate = new Date(stats.last_quiz_date);
  const today = new Date();
  
  const diffTime = today - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return stats.streak_days;
  } else if (diffDays === 1) {
    return stats.streak_days + 1;
  }
  return 0; // streak broken
}

export function updateStreak() {
  const newStreak = calculateStreak();
  const stats = getUserStats();
  
  updateUserStats(
    stats.total_quizzes,
    stats.total_score,
    newStreak,
    new Date().toISOString()
  );
  
  return newStreak;
}

export function recordQuizCompletion(score) {
  const stats = getUserStats();
  const newTotal = (stats?.total_quizzes || 0) + 1;
  const newScore = (stats?.total_score || 0) + score;
  const newStreak = updateStreak();
  
  updateUserStats(
    newTotal,
    newScore,
    newStreak,
    new Date().toISOString()
  );
  
  return {
    total_quizzes: newTotal,
    average_score: (newScore / newTotal).toFixed(2),
    streak: newStreak
  };
}

export function getLeaderboard(limit = 10) {
  const stmt = db.prepare(`
    SELECT 
      t.name,
      t.slug,
      COUNT(q.id) as attempts,
      ROUND(AVG(q.score), 2) as avg_score,
      MAX(q.created_at) as last_attempted
    FROM topics t
    LEFT JOIN quizzes q ON t.id = q.topic_id AND q.completed = 1
    GROUP BY t.id
    ORDER BY avg_score DESC, attempts DESC
    LIMIT ?
  `);
  return stmt.all(limit);
}

export function calculateBadges() {
  const stats = getUserStats();
  const badges = [];

  if (stats.total_quizzes >= 1) badges.push('First Step 🎯');
  if (stats.total_quizzes >= 10) badges.push('Learner 📚');
  if (stats.total_quizzes >= 50) badges.push('Scholar 🏆');
  if (stats.total_quizzes >= 100) badges.push('Master 👑');
  if (stats.streak_days >= 7) badges.push('Week Warrior 🔥');
  if (stats.streak_days >= 30) badges.push('Month Master 🌟');
  if (stats.total_score / stats.total_quizzes >= 90) badges.push('Perfect Score 💯');

  return badges;
}

export function getProgress() {
  const stats = getUserStats();
  return {
    total_quizzes: stats?.total_quizzes || 0,
    average_score: stats?.total_quizzes ? (stats.total_score / stats.total_quizzes).toFixed(2) : 0,
    streak: stats?.streak_days || 0,
    badges: calculateBadges()
  };
}

export default {
  calculateStreak,
  updateStreak,
  recordQuizCompletion,
  getLeaderboard,
  calculateBadges,
  getProgress
};