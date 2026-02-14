import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
  dbPath: path.resolve(__dirname, '../data.db')
};

export function validateOpenAIKey() {
  if (!config.openaiApiKey) {
    console.error('❌ Error: OPENAI_API_KEY not set in .env file');
    console.log('\nTo use AI quiz generation:');
    console.log('1. Create a .env file (copy from .env.example)');
    console.log('2. Add your OpenAI API key: OPENAI_API_KEY=sk-...');
    console.log('3. Get one at: https://platform.openai.com/api-keys\n');
    return false;
  }
  return true;
}

export default config;
