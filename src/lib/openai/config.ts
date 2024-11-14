export const OPENAI_CONFIG = {
  pollingInterval: 1000,
  maxRetries: 3,
  assistantId: import.meta.env.VITE_OPENAI_ASSISTANT_ID,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
} as const;