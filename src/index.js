#!/usr/bin/env node

import { Command } from 'commander';
import { config, validateOpenAIKey } from './config.js';
import { 
  initDb, 
  initUserStats,
  addTopic, 
  getTopic, 
  getAllTopics,
  saveQuiz
} from './db.js';
import { generateQuiz } from './services/quizzService.js';
import { suggestDailyChallenge, getTopicStats } from './services/weaknessService.js';
import { recordQuizCompletion, getProgress, getLeaderboard } from './services/gamificationService.js';
import { runQuizInteractive, formatScore, close } from './utils.js';
import { OpenAI } from 'openai';

const program = new Command();

program
  .name('deeptrack')
  .description('AI-powered learning tracker with gamified quizzes')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize database')
  .action(() => {
    initDb();
    initUserStats();
    console.log('✓ Database initialized');
  });

program
  .command('learn <topic>')
  .description('Add a new learning topic')
  .option('-d, --description <text>', 'Topic description')
  .action((topic, options) => {
    try {
      const id = addTopic(topic, options.description || '');
      const slug = topic.toLowerCase().replace(/\s+/g, '-');
      console.log(`✓ Topic added: "${topic}" (${slug})`);
      console.log(`  Run: deeptrack quiz ${slug}`);
    } catch (error) {
      console.error(`✗ ${error.message}`);
    }
  });

program
  .command('topics')
  .description('List all learning topics')
  .action(() => {
    const topics = getAllTopics();
    if (topics.length === 0) {
      console.log('No topics found. Add one with: deeptrack learn <topic>');
      return;
    }
    console.table(topics.map(t => ({
      Name: t.name,
      Slug: t.slug,
      Created: new Date(t.created_at).toLocaleDateString()
    })));
  });

program
  .command('quiz <topicSlug>')
  .description('Generate and take a quiz on a topic')
  .option('--mock', 'Use mock quiz (no API call)')
  .action(async (topicSlug, options) => {
    try {
      const topic = getTopic(topicSlug);
      if (!topic) {
        console.error(`✗ Topic "${topicSlug}" not found`);
        console.log('   Use: deeptrack topics');
        return;
      }

      console.log(`\n📚 Quiz: ${topic.name}\n`);

      let openaiClient = null;
      if (!options.mock && validateOpenAIKey()) {
        openaiClient = new OpenAI({ apiKey: config.openaiApiKey });
      }

      const quiz = await generateQuiz(topic.name, openaiClient);
      const quizId = saveQuiz(topic.id, quiz);

      // Run quiz interactively
      await runQuizInteractive(quiz, async (answers, score) => {
        console.log(`\n${formatScore(score)}\n`);
        console.log(`Correct answers: ${answers.filter((a, i) => a === quiz.questions[i].correct_answer).length}/${quiz.questions.length}\n`);
        
        // Record completion
        recordQuizCompletion(score);
        
        const progress = getProgress();
        console.log('📊 Your Stats:');
        console.log(`   Total Quizzes: ${progress.total_quizzes}`);
        console.log(`   Average Score: ${progress.average_score}%`);
        console.log(`   Streak: ${progress.streak} day(s)`);
        if (progress.badges.length > 0) {
          console.log(`   Badges: ${progress.badges.join(', ')}`);
        }
        console.log();
      });

      close();
    } catch (error) {
      console.error(`✗ Error: ${error.message}`);
      close();
    }
  });

program
  .command('daily')
  .description('Take today\'s recommended quiz challenge')
  .option('--mock', 'Use mock quiz')
  .action(async (options) => {
    try {
      const challenge = suggestDailyChallenge();
      if (!challenge) {
        console.log('📚 No topics yet. Add one with: deeptrack learn <topic>');
        return;
      }

      console.log(`\n🎯 Daily Challenge: ${challenge.name}\n`);

      let openaiClient = null;
      if (!options.mock && validateOpenAIKey()) {
        openaiClient = new OpenAI({ apiKey: config.openaiApiKey });
      }

      const quiz = await generateQuiz(challenge.name, openaiClient);
      saveQuiz(challenge.id, quiz);

      await runQuizInteractive(quiz, async (answers, score) => {
        console.log(`\n${formatScore(score)}\n`);
        recordQuizCompletion(score);
      });

      close();
    } catch (error) {
      console.error(`✗ Error: ${error.message}`);
      close();
    }
  });

program
  .command('stats [topic]')
  .description('View performance statistics')
  .action((topic) => {
    const progress = getProgress();
    
    console.log('\n📊 Your Statistics\n');
    console.log(`Total Quizzes Taken: ${progress.total_quizzes}`);
    console.log(`Average Score: ${progress.average_score}%`);
    console.log(`Current Streak: ${progress.streak} day(s)`);
    
    if (progress.badges.length > 0) {
      console.log(`\nBadges Earned: ${progress.badges.join(', ')}`);
    }

    if (topic) {
      const t = getTopic(topic);
      if (!t) {
        console.error(`\nTopic "${topic}" not found`);
        return;
      }
      const stats = getTopicStats(t.id);
      console.log(`\nTopic: ${t.name}`);
      console.log(`  Attempts: ${stats?.total_attempts || 0}`);
      console.log(`  Average Score: ${stats?.avg_score || 'N/A'}%`);
      console.log(`  Last Attempted: ${stats?.last_attempted ? new Date(stats.last_attempted).toLocaleDateString() : 'Never'}`);
    }
    console.log();
  });

program
  .command('leaderboard')
  .description('View topic leaderboard')
  .action(() => {
    const leaderboard = getLeaderboard();
    if (leaderboard.length === 0) {
      console.log('No data yet. Take a quiz to see rankings!');
      return;
    }
    console.table(leaderboard.map((t, i) => ({
      Rank: i + 1,
      Topic: t.name,
      'Avg Score': `${t.avg_score}%`,
      Attempts: t.attempts
    })));
  });

program
  .command('monthly')
  .description('View monthly performance report')
  .action(() => {
    const progress = getProgress();
    console.log('\n📈 Monthly Report\n');
    console.log(`Quizzes This Month: ${progress.total_quizzes}`);
    console.log(`Average Performance: ${progress.average_score}%`);
    console.log(`Longest Streak: ${progress.streak} days`);
    console.log(`\n🏆 Badges: ${progress.badges.length > 0 ? progress.badges.join(', ') : 'None yet'}\n`);
  });

program.parse(process.argv);
