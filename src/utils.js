import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

export function close() {
  rl.close();
}

export async function runQuizInteractive(quiz, onComplete) {
  console.log(`\n📝 ${quiz.title}\n`);
  
  const userAnswers = [];
  const correctAnswers = [];

  for (let i = 0; i < quiz.questions.length; i++) {
    const q = quiz.questions[i];
    correctAnswers.push(q.correct_answer);
    
    console.log(`Question ${i + 1}/${quiz.questions.length}:`);
    console.log(q.question);
    console.log();
    
    q.options.forEach((opt, idx) => {
      console.log(`  ${idx + 1}. ${opt}`);
    });
    
    let validAnswer = false;
    while (!validAnswer) {
      const answer = await question('\nYour answer (1-4): ');
      const choice = parseInt(answer) - 1;
      
      if (choice >= 0 && choice < 4) {
        userAnswers.push(choice);
        validAnswer = true;
      } else {
        console.log('Invalid choice. Please enter 1-4.');
      }
    }
    console.log();
  }

  const score = calculateScore(userAnswers, correctAnswers);
  await onComplete(userAnswers, score);
}

export function calculateScore(userAnswers, correctAnswers) {
  const correct = userAnswers.filter((a, i) => a === correctAnswers[i]).length;
  return Math.round((correct / userAnswers.length) * 100);
}

export function formatScore(score) {
  if (score >= 90) return `🌟 Excellent! ${score}%`;
  if (score >= 80) return `👍 Great! ${score}%`;
  if (score >= 70) return `📚 Good ${score}%`;
  if (score >= 60) return `💪 Keep practicing ${score}%`;
  return `⚡ Try again ${score}%`;
}

export default {
  question,
  close,
  runQuizInteractive,
  calculateScore,
  formatScore
};
