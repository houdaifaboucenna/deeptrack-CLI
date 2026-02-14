# DeepTrack - AI-Powered Learning Tracker

A gamified CLI tool that helps you learn new topics and get tested with AI-generated quizzes. Track your daily progress, identify weak areas, and unlock badges as you master new subjects. Includes a beautiful web dashboard for real-time statistics.

## Features

✅ **Topic Management** - Add topics and track learning progress  
✅ **AI Quiz Generation** - Powered by OpenAI GPT (with mock fallback)  
✅ **Interactive Quiz Mode** - Answer questions in the terminal  
✅ **Web Dashboard** - Real-time statistics at http://localhost:3000  
✅ **REST API** - Full API for dashboard and integrations  
✅ **Gamification** - Streaks, badges, and leaderboards  
✅ **Statistics** - Track performance over time  
✅ **Daily Challenges** - Personalized quizzes based on weak topics  
✅ **Fully Tested** - 14/14 integration tests passing  
✅ **Production Ready** - Clean architecture and comprehensive documentation  

## Quick Start

### 1. Setup

```bash
npm install
npm start init
```

### 2. Add Topics

```bash
npm start learn "Laravel Queues"
npm start learn "React Hooks"
npm start learn "Docker Networking"
```

### 3. Take Quizzes

```bash
# Take a quiz on a specific topic (mock mode - no API key needed)
npm start quiz laravel-queues --mock

# Take with OpenAI (requires API key in .env)
npm start quiz laravel-queues

# Take today's personalized challenge
npm start daily --mock

# View all topics
npm start topics

# View your stats
npm start stats
npm start stats laravel-queues

# View leaderboard
npm start leaderboard

# Monthly report
npm start monthly
```

### 4. Start Dashboard

```bash
npm run dashboard
# Open http://localhost:3000
```

The dashboard auto-refreshes every 5 seconds and displays:
- Your overall statistics (quizzes, average score, streak)
- All topics with attempts and scores
- Achievement badges
- Best-performing topics

## Configuration

To use AI-powered quiz generation:

1. Copy `.env.example` to `.env`
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-...
   ```
3. Get a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

**Without an API key**, quizzes will use mock data - fully functional!

## CLI Commands

| Command | Description |
|---------|-------------|
| `npm start init` | Initialize database |
| `npm start learn <topic>` | Add a new learning topic |
| `npm start topics` | List all topics |
| `npm start quiz <slug>` | Take a quiz on a topic |
| `npm start quiz <slug> --mock` | Use mock quiz (no API call) |
| `npm start daily` | Take AI-recommended daily challenge |
| `npm start daily --mock` | Use mock daily quiz |
| `npm start stats [topic]` | View your statistics |
| `npm start leaderboard` | View top-performing topics |
| `npm start monthly` | View monthly performance report |

## Dashboard & API

### Web Dashboard

```bash
npm run dashboard
# Visit http://localhost:3000
```

Features:
- Real-time statistics display
- Progress bars for each topic
- Achievement badges
- Auto-refresh every 5 seconds
- Mobile-responsive design

### REST API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stats` | GET | User statistics and progress |
| `/api/topics` | GET | All topics with individual stats |
| `/api/weak-topics` | GET | Topics below 70% average |
| `/api/daily-challenge` | GET | AI-selected daily challenge |
| `/api/leaderboard` | GET | Top-performing topics |

Example response from `/api/topics`:
```json
[
  {
    "id": 1,
    "name": "React Hooks",
    "slug": "react-hooks",
    "stats": {
      "total_attempts": 3,
      "avg_score": 85.33,
      "last_attempted": "2026-02-14 14:07:22"
    }
  }
]
```

## Architecture

```
GamifiedLearningPlatform/
├── src/                          # CLI Application
│   ├── index.js                  # CLI entry point
│   ├── db.js                     # SQLite database layer
│   ├── config.js                 # Configuration & environment
│   ├── utils.js                  # Interactive quiz utilities
│   └── services/
│       ├── quizzService.js       # Quiz generation & management
│       ├── weaknessService.js    # Analytics & weak topic detection
│       └── gamificationService.js # Streaks, badges, stats
├── dashboard/                    # Web Dashboard
│   ├── server.js                 # Express.js API server
│   └── public/
│       └── index.html            # Responsive web UI
├── tests/
│   └── integration.test.js       # 14 integration tests
├── .env.example                  # Configuration template
├── package.json                  # Dependencies
├── data.db                       # SQLite database (auto-created)
└── README.md                     # This file
```

## Database Schema

Four SQLite tables:

- **topics** - Learning subjects with metadata
  - id, name, slug, description, created_at, updated_at
  
- **quizzes** - Generated quiz instances
  - id, topic_id, questions_json, score, completed, created_at
  
- **quiz_responses** - User answers and scores (primary stats source)
  - id, quiz_id, answers_json, score, timestamp
  
- **user_stats** - Overall progress tracking
  - id, total_quizzes, total_score, streak_days, last_quiz_date, updated_at

## Gamification System

### Badges (Unlocked by Milestones)

Earn badges as you progress:

| Badge | Requirement |
|-------|------------|
| 🎯 First Step | Complete 1 quiz |
| 📚 Learner | Complete 10 quizzes |
| 🏆 Scholar | Complete 50 quizzes |
| 👑 Master | Complete 100 quizzes |
| 🔥 Week Warrior | 7-day streak |
| 🌟 Month Master | 30-day streak |
| 💯 Perfect Score | 90%+ average score |

### Streaks

Track your learning consistency:
- Daily streak counter (increments with each quiz attempt)
- Visible in stats and dashboard
- Reset if you miss a day

### Leaderboard

See your best-performing topics:
```bash
npm start leaderboard
```

Sorted by:
1. Average score (highest first)
2. Number of attempts (most first)

## How Data Flows

```
User takes quiz (CLI)
  ↓
Quiz generated & saved
  ↓
User answers questions
  ↓
Responses recorded → quiz_responses table ✓
Score calculated
  ↓
User stats updated → user_stats table ✓
Streak & badges calculated
  ↓
Dashboard API reads from quiz_responses
  ↓
Web UI displays stats in real-time ✓
```

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for:
- OpenAI API issues
- Database problems
- CLI command errors
- Dashboard connectivity
- Performance optimization

## Development

```bash
npm install          # Install dependencies
npm start [cmd]      # Run CLI command
npm run dev          # Watch mode for CLI
npm run dashboard    # Start web dashboard
npm run dashboard:dev # Dashboard watch mode
npm test             # Run 14 integration tests
```

## Testing

All 14 integration tests pass:

```bash
npm test

# Expected output:
# ✓ Database operations
# ✓ Quiz generation and scoring
# ✓ Gamification logic
# ✓ Service functionality
# 
# Tests Passed: 14 ✓
# Tests Failed: 0 ✗
```

Test coverage includes:
- Database CRUD operations
- Quiz generation and scoring
- Statistics calculation
- Gamification (streaks, badges)
- API endpoint validation
- End-to-end quiz flow

## Project Status

✅ **Complete & Production Ready**

- All 4 implementation phases complete
- 14/14 integration tests passing
- Full documentation (README, SETUP, TROUBLESHOOTING)
- Bug fixes applied (dashboard statistics)
- Clean project structure
- Ready for deployment or further development

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js 16+ (ES Modules) |
| CLI Framework | Commander.js |
| Database | SQLite (better-sqlite3) |
| Web Server | Express.js |
| LLM Integration | OpenAI API (GPT-3.5-turbo) |
| Configuration | dotenv |
| Testing | Native Node.js test framework |

## License

ISC

