import db, { saveQuiz, getQuiz, submitQuizAnswer, getQuizHistory } from '../db.js';

export function generateQuizPrompt(topicName) {
  return `Generate a quiz with 5 multiple-choice questions about "${topicName}". 
Format your response as a JSON object with this exact structure:
{
  "title": "Quiz on ${topicName}",
  "questions": [
    {
      "id": 1,
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0
    }
  ]
}
Return ONLY valid JSON, no markdown formatting or extra text.`;
}

export async function generateQuiz(topicName, openaiClient = null) {
  if (!openaiClient) {
    return generateMockQuiz(topicName);
  }

  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: generateQuizPrompt(topicName)
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    const quiz = JSON.parse(content);
    return quiz;
  } catch (error) {
    console.error('Error generating quiz with OpenAI:', error.message);
    return generateMockQuiz(topicName);
  }
}

export function generateMockQuiz(topicName) {
  return {
    title: `Quiz on ${topicName}`,
    questions: [
      {
        id: 1,
        question: `What is the primary purpose of ${topicName}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct_answer: 0
      },
      {
        id: 2,
        question: `How is ${topicName} typically implemented?`,
        options: ['Method 1', 'Method 2', 'Method 3', 'Method 4'],
        correct_answer: 1
      },
      {
        id: 3,
        question: `What are the benefits of ${topicName}?`,
        options: ['Benefit A', 'Benefit B', 'Benefit C', 'Benefit D'],
        correct_answer: 2
      },
      {
        id: 4,
        question: `Which scenario best uses ${topicName}?`,
        options: ['Scenario A', 'Scenario B', 'Scenario C', 'Scenario D'],
        correct_answer: 3
      },
      {
        id: 5,
        question: `What is a common challenge with ${topicName}?`,
        options: ['Challenge A', 'Challenge B', 'Challenge C', 'Challenge D'],
        correct_answer: 0
      }
    ]
  };
}

export function calculateScore(userAnswers, correctAnswers) {
  if (userAnswers.length !== correctAnswers.length) {
    throw new Error('Answer count mismatch');
  }

  const correct = userAnswers.filter((answer, idx) => answer === correctAnswers[idx]).length;
  return (correct / userAnswers.length) * 100;
}

export function saveQuizResult(topicId, quizData) {
  return saveQuiz(topicId, quizData);
}

export function getQuizById(quizId) {
  return getQuiz(quizId);
}

export function getTopicQuizzes(topicId, limit = 10) {
  return getQuizHistory(topicId, limit);
}

export function recordAnswer(quizId, userAnswers, score) {
  submitQuizAnswer(quizId, userAnswers, score);
}

export default {
  generateQuiz,
  generateMockQuiz,
  generateQuizPrompt,
  calculateScore,
  saveQuizResult,
  getQuizById,
  getTopicQuizzes,
  recordAnswer
};