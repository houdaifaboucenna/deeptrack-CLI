# TROUBLESHOOTING GUIDE

## Common Issues & Solutions

### OpenAI API Integration

**Issue**: Quiz generation fails or returns empty response

**Solutions**:
1. Verify API key is set: `cat .env | grep OPENAI_API_KEY`
2. Check API key is valid at https://platform.openai.com/api-keys
3. Ensure rate limits aren't exceeded (OpenAI has per-minute limits)
4. Use `--mock` flag to test without API: `deeptrack quiz laravel-queues --mock`

**Cost Management**:
- GPT-3.5-turbo is ~$0.0005 per quiz (5 questions)
- Monitor usage at https://platform.openai.com/account/billing/usage
- Consider caching quizzes or using mock mode for development

### Database Issues

**Issue**: `data.db is locked` error

**Solutions**:
1. Ensure only one instance is running
2. Stop all CLI and dashboard processes
3. Delete and reinitialize: `rm data.db && npm start init`
4. Check for zombie processes: `ps aux | grep node`

**Issue**: Database corruption

**Solutions**:
1. Backup existing database: `cp data.db data.db.backup`
2. Reinitialize: `rm data.db && npm start init`
3. Restore from backup if needed: `cp data.db.backup data.db`

### CLI Issues

**Issue**: CLI commands not recognized

**Solutions**:
1. Reinstall dependencies: `npm install`
2. Clear module cache: `rm -rf node_modules && npm install`
3. Verify file permissions: `chmod +x src/index.js`

**Issue**: Interactive quiz doesn't accept input

**Solutions**:
1. Use non-interactive mode with mock: `deeptrack quiz topic --mock`
2. Ensure running in terminal (not in IDE without input capture)
3. Check terminal supports STDIN

### Dashboard Issues

**Issue**: Dashboard shows "No data" even with quizzes taken

**Solutions**:
1. Verify API server is running: `npm run dashboard`
2. Check port 3000 is available: `lsof -i :3000`
3. Refresh browser: Ctrl+Shift+R (full refresh)
4. Check browser console for errors: F12 → Console tab

**Issue**: CORS errors when accessing dashboard

**Solutions**:
1. Ensure Express server is running on correct port
2. Check CORS middleware is installed: `npm install cors`
3. Use same domain/port or configure CORS properly

### Performance Issues

**Issue**: Dashboard is slow to load/refresh

**Solutions**:
1. Reduce refresh interval in dashboard UI (default 5s)
2. Disable auto-refresh during large quizzes
3. Clear browser cache
4. Restart dashboard server

### Development Issues

**Issue**: Tests fail or timeout

**Solutions**:
1. Run with verbose output: `node tests/integration.test.js`
2. Check database isn't locked from previous run
3. Ensure all dependencies installed: `npm install`

**Issue**: Watch mode (`--watch`) not reloading

**Solutions**:
1. Node version 19.2+ required: `node --version`
2. Restart watch process
3. Use simpler restart: `npm start` + manual restart

## Getting Help

1. Check database: `sqlite3 data.db "SELECT * FROM topics;"`
2. View recent errors: Check console output
3. Test API directly:
   ```bash
   curl http://localhost:3000/api/stats
   curl http://localhost:3000/api/topics
   ```
4. Check logs in real-time: `npm run dashboard:dev`

## Useful Commands

```bash
# Database inspection
sqlite3 data.db ".tables"
sqlite3 data.db "SELECT * FROM topics;"
sqlite3 data.db "SELECT COUNT(*) FROM quizzes;"

# Process management
ps aux | grep node
kill <PID>

# Port checking
lsof -i :3000
netstat -an | grep 3000

# Environment debugging
echo $OPENAI_API_KEY
cat .env
```

## Quick Reset

```bash
# Complete reset (careful!)
rm -f data.db data.db-journal
npm start init
npm start learn "My First Topic"
npm start quiz my-first-topic --mock
```
