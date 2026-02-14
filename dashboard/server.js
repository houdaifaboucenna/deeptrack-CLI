import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getAllTopics,
  initDb,
  initUserStats
} from '../src/db.js';
import { 
  getTopicStats,
  identifyWeakTopics,
  suggestDailyChallenge
} from '../src/services/weaknessService.js';
import { 
  getProgress,
  getLeaderboard
} from '../src/services/gamificationService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
initDb();
initUserStats();

// API Routes

// Get user stats
app.get('/api/stats', (req, res) => {
  try {
    const progress = getProgress();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all topics with stats
app.get('/api/topics', (req, res) => {
  try {
    const topics = getAllTopics();
    const topicsWithStats = topics.map(t => ({
      ...t,
      stats: getTopicStats(t.id)
    }));
    res.json(topicsWithStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get weak topics
app.get('/api/weak-topics', (req, res) => {
  try {
    const weakTopics = identifyWeakTopics(70);
    res.json(weakTopics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get daily challenge suggestion
app.get('/api/daily-challenge', (req, res) => {
  try {
    const challenge = suggestDailyChallenge();
    if (!challenge) {
      return res.json({ message: 'No topics yet' });
    }
    res.json({
      ...challenge,
      stats: getTopicStats(challenge.id)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  try {
    const leaderboard = getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve index.html for SPA
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🎯 DeepTrack Dashboard running at http://localhost:${PORT}\n`);
});
