import OpenAI from 'openai';
import { OPENAI_CONFIG } from './config';

export const openai = new OpenAI({
  apiKey: OPENAI_CONFIG.apiKey,
  dangerouslyAllowBrowser: true,
});