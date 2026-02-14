# DeepTrack - AI-Powered Learning Tracker

A gamified CLI tool that helps you learn new topics and get tested with AI-generated quizzes. Track your daily progress, identify weak areas, and unlock badges as you master new subjects.

## Features

✅ **Topic Management** - Add topics and track learning progress  
✅ **AI Quiz Generation** - Powered by OpenAI GPT  
✅ **Interactive Quiz Mode** - Answer questions in the terminal  
✅ **Gamification** - Streaks, badges, and leaderboards  
✅ **Statistics** - Track performance over time  
✅ **Daily Challenges** - Personalized quizzes based on weak topics  

## Quick Start

### 1. Setup

```bash
npm install
npm start init
```

### 2. Add Topics

```bash
deeptrack learn "Laravel Queues"
deeptrack learn "React Hooks"
deeptrack learn "Docker Networking"
```

### 3. Take Quizzes

```bash
# Take a quiz on a specific topic
deeptrack quiz laravel-queues

# Take today's AI-selected challenge
deeptrack daily

# View all topics
deeptrack topics

# View your stats
deeptrack stats
deeptrack stats laravel-queues

# View leaderboard
deeptrack leaderboard
```

## Configuration

To use AI-powered quiz generation:

1. Copy `.env.example` to `.env`
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-...
   ```
3. Get a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

Without an API key, quizzes will use mock data.

## CLI Commands

| Command | Description |
|---------|-------------|
| `deeptrack init` | Initialize database |
| `deeptrack learn <topic>` | Add a new learning topic |
| `deeptrack topics` | List all topics |
| `deeptrack quiz <slug>` | Take a quiz on a topic |
| `deeptrack quiz <slug> --mock` | Use mock quiz (no API call) |
| `deeptrack daily` | Take AI-recommended daily challenge |
| `deeptrack daily --mock` | Use mock daily quiz |
| `deeptrack stats [topic]` | View your statistics |
| `deeptrack leaderboard` | View top-performing topics |
| `deeptrack monthly` | View monthly performance report |

## Architecture

```
deeptrack/
├── src/
│   ├── index.js              # CLI entry point
│   ├── config.js             # Configuration & env setup
│   ├── db.js                 # SQLite database layer
│   ├── utils.js              # Interactive quiz utilities
│   └── services/
│       ├── quizzService.js   # Quiz generation & management
│       ├── weaknessService.js # Identify weak topics
│       └── gamificationService.js # Streaks, badges, stats
├── dashboard/                # Coming: Web dashboard
├── .env                      # OpenAI configuration
└── data.db                   # SQLite database
```

## Database Schema

- **topics** - Learning subjects
- **quizzes** - Generated quizzes with questions
- **quiz_responses** - User answers and scores
- **user_stats** - Overall progress and streaks

## Gamification

- **Badges**: Unlock badges for milestones
  - First Step 🎯 (1 quiz)
  - Learner 📚 (10 quizzes)
  - Scholar 🏆 (50 quizzes)
  - Master 👑 (100 quizzes)
  - Week Warrior 🔥 (7-day streak)
  - Month Master 🌟 (30-day streak)
  - Perfect Score 💯 (90%+ average)

- **Streaks**: Track consecutive days with quizzes
- **Leaderboard**: See your best-performing topics

## Development

```bash
npm start [command]    # Run a command
npm run dev           # Watch mode for development
```

## License

ISC

