# SETUP GUIDE

## Installation

### 1. Prerequisites
- Node.js 16+ (check with `node --version`)
- npm 7+ (check with `npm --version`)

### 2. Clone & Setup

```bash
git clone <repository>
cd GamifiedLearningPlatform
npm install
```

### 3. Configure OpenAI (Optional)

To use AI-powered quiz generation:

```bash
# Copy template
cp .env.example .env

# Edit and add your API key
nano .env
```

Get your API key:
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy and paste into `.env` file

**Without API key**, mock quizzes will be used (still fully functional).

### 4. Initialize Database

```bash
npm start init
```

This creates the SQLite database and tables.

## First Run

### CLI Usage

```bash
# Add your first topic
npm start learn "Node.js Async/Await"

# See all topics
npm start topics

# Take a quiz (mock mode if no API key)
npm start quiz node-js-asyncawait --mock

# View stats
npm start stats
```

### Dashboard Usage

```bash
# Start dashboard server
npm run dashboard

# Open browser to http://localhost:3000

# View real-time stats
# Auto-refreshes every 5 seconds
```

## Running Concurrently

In separate terminals:

```bash
# Terminal 1: CLI
npm run dev

# Terminal 2: Dashboard
npm run dashboard:dev
```

## Project Structure

```
GamifiedLearningPlatform/
├── src/
│   ├── index.js              # CLI entry point
│   ├── db.js                 # Database layer
│   ├── config.js             # Configuration
│   ├── utils.js              # CLI utilities
│   └── services/
│       ├── quizzService.js   # Quiz management
│       ├── weaknessService.js # Topic analysis
│       └── gamificationService.js # Stats & badges
├── dashboard/
│   ├── server.js             # Express server
│   └── public/
│       └── index.html        # Web UI
├── tests/
│   └── integration.test.js   # Test suite
├── .env.example              # Config template
├── package.json              # Dependencies
└── data.db                   # SQLite database
```

## Testing

```bash
npm test
```

All 14 integration tests should pass.

## Environment Variables

### `.env` File

```bash
# Required for AI quiz generation
OPENAI_API_KEY=sk-...

# Optional: specify model (default: gpt-3.5-turbo)
# OPENAI_MODEL=gpt-4

# Optional: dashboard port (default: 3000)
# PORT=3000
```

## Common Workflows

### Learning a New Topic

```bash
# 1. Add topic with description
npm start learn "React Hooks" -d "Learn React hooks pattern"

# 2. Take quiz (uses mock data)
npm start quiz react-hooks --mock

# 3. Check progress
npm start stats react-hooks

# 4. See on dashboard
npm run dashboard
# Open http://localhost:3000
```

### Daily Practice

```bash
# Get today's personalized challenge (weak topic)
npm start daily --mock

# View your streak
npm start stats
```

### Tracking Progress

```bash
# Overall stats
npm start stats

# Specific topic
npm start stats react-hooks

# See best topics
npm start leaderboard

# Monthly report
npm start monthly

# Dashboard
npm run dashboard
```

## Troubleshooting

### Quiz generation fails?
- Check `.env` has valid `OPENAI_API_KEY`
- Use `--mock` flag to skip API
- See `TROUBLESHOOTING.md`

### Database locked?
```bash
# Restart everything
rm data.db
npm start init
```

### Dashboard not loading?
```bash
# Check server is running
npm run dashboard

# Check port 3000 available
lsof -i :3000

# Clear browser cache (Ctrl+Shift+R)
```

## Next Steps

1. **Add topics**: `npm start learn "Topic Name"`
2. **Take quizzes**: `npm start quiz topic-slug`
3. **Track progress**: View stats and badges
4. **View dashboard**: `npm run dashboard`
5. **Check troubleshooting**: See `TROUBLESHOOTING.md` if issues

## Need Help?

- Check `TROUBLESHOOTING.md` for common issues
- Review `README.md` for feature list
- Inspect database: `sqlite3 data.db .schema`
- View logs: Run `npm run dashboard:dev` for verbose output
