export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AssistantResponse {
  message: string;
  threadId: string;
}

export interface AssistantError {
  message: string;
  code: string;
}