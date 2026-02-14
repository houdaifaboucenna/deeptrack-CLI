import { 
  initDb,
  initUserStats,
  addTopic,
  getTopic,
  getAllTopics,
  saveQuiz,
  getUserStats
} from '../src/db.js';
import { 
  getTopicStats,
  suggestDailyChallenge
} from '../src/services/weaknessService.js';
import { 
  recordQuizCompletion,
  getProgress
} from '../src/services/gamificationService.js';
import { 
  generateMockQuiz,
  calculateScore
} from '../src/services/quizzService.js';

console.log('🧪 Running Integration Tests...\n');

// Initialize
initDb();
initUserStats();

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    testsPassed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
    testsFailed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message} (expected ${expected}, got ${actual})`);
  }
}

// Tests
test('Database: Add topic', () => {
  const id = addTopic('Test Topic', 'A test');
  assert(id > 0, 'Topic ID should be positive');
});

test('Database: Retrieve topic by name', () => {
  addTopic('React Learning', 'Learn React');
  const topic = getTopic('React Learning');
  assertEqual(topic.name, 'React Learning', 'Should find topic by name');
});

test('Database: Retrieve topic by slug', () => {
  const topic = getTopic('react-learning');
  assertEqual(topic.slug, 'react-learning', 'Should find topic by slug');
});

test('Database: List all topics', () => {
  const topics = getAllTopics();
  assert(topics.length >= 1, 'Should list topics');
});

test('Database: Prevent duplicate topics', () => {
  addTopic('Unique Test');
  try {
    addTopic('Unique Test');
    throw new Error('Should have thrown');
  } catch (e) {
    if (!e.message.includes('already exists')) throw e;
  }
});

test('Quiz: Generate mock quiz', () => {
  const quiz = generateMockQuiz('Test');
  assertEqual(quiz.questions.length, 5, 'Should generate 5 questions');
  quiz.questions.forEach(q => {
    assert(q.question, 'Question should have text');
    assertEqual(q.options.length, 4, 'Should have 4 options');
  });
});

test('Quiz: Calculate perfect score', () => {
  const correctAnswers = [0, 1, 2, 3, 0];
  const userAnswers = [0, 1, 2, 3, 0];
  const score = calculateScore(userAnswers, correctAnswers);
  assertEqual(score, 100, 'Perfect score should be 100%');
});

test('Quiz: Calculate partial score', () => {
  const correctAnswers = [0, 1, 2, 3, 0];
  const userAnswers = [0, 1, 2, 0, 0];
  const score = calculateScore(userAnswers, correctAnswers);
  assertEqual(score, 80, 'Should calculate 80%');
});

test('Quiz: Save quiz', () => {
  const topicId = addTopic('Quiz Save Test');
  const quiz = generateMockQuiz('Test');
  const quizId = saveQuiz(topicId, quiz);
  assert(quizId > 0, 'Should save quiz');
});

test('Gamification: Record quiz completion', () => {
  const before = getProgress();
  const initialCount = before.total_quizzes;
  
  recordQuizCompletion(85);
  const after = getProgress();
  
  assert(after.total_quizzes > initialCount, 'Should increment quiz count');
});

test('Gamification: Award badge for first quiz', () => {
  const progress = getProgress();
  assert(
    progress.badges.includes('First Step 🎯'),
    'Should award First Step badge'
  );
});

test('Gamification: Calculate average score', () => {
  recordQuizCompletion(90);
  recordQuizCompletion(80);
  
  const progress = getProgress();
  assert(progress.average_score > 0, 'Should calculate average');
});

test('Weakness: Suggest daily challenge', () => {
  const challenge = suggestDailyChallenge();
  assert(challenge !== null, 'Should suggest a topic');
  assert(challenge.name, 'Challenge should have name');
});

test('Weakness: Get topic stats', () => {
  const topicId = addTopic('Stats Test');
  const stats = getTopicStats(topicId);
  assert(stats, 'Should return stats');
});

// Summary
console.log(`\n${'='.repeat(50)}`);
console.log(`Tests Passed: ${testsPassed} ✓`);
console.log(`Tests Failed: ${testsFailed} ✗`);
console.log(`Total: ${testsPassed + testsFailed}`);
console.log(`${'='.repeat(50)}\n`);

if (testsFailed > 0) {
  process.exit(1);
}
