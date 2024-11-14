import { openai } from './client';
import { OPENAI_CONFIG } from './config';
import type { AssistantResponse, AssistantError } from './types';

async function pollRunStatus(threadId: string, runId: string): Promise<void> {
  let attempts = 0;
  
  while (true) {
    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    
    if (runStatus.status === 'completed') {
      return;
    }
    
    if (runStatus.status === 'failed') {
      throw new Error('Assistant failed to process the request');
    }
    
    if (attempts >= OPENAI_CONFIG.maxRetries) {
      throw new Error('Maximum polling attempts reached');
    }
    
    attempts++;
    await new Promise(resolve => setTimeout(resolve, OPENAI_CONFIG.pollingInterval));
  }
}

export async function getChatResponse(message: string): Promise<AssistantResponse> {
  if (!OPENAI_CONFIG.apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    // Create a new thread
    const thread = await openai.beta.threads.create();

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });

    // Start the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: OPENAI_CONFIG.assistantId
    });

    // Wait for the assistant to complete
    await pollRunStatus(thread.id, run.id);

    // Get the assistant's response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const response = messages.data[0].content[0].text.value;

    return {
      message: response,
      threadId: thread.id
    };
  } catch (error) {
    console.error('OpenAI Assistant error:', error);
    throw error;
  }
}