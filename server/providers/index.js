import { generateGeminiReply } from './gemini.js';

const providers = new Map([['gemini', generateGeminiReply]]);

export function getAiProvider(name) {
  const generate = providers.get(name);
  return generate ? { name, generate } : null;
}
