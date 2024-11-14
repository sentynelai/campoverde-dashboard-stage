import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getChatResponse(message: string) {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const thread = await openai.beta.threads.create();
    
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: import.meta.env.VITE_OPENAI_ASSISTANT_ID
    });

    // Poll for completion
    let response;
    while (true) {
      const runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      if (runStatus.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(thread.id);
        response = messages.data[0].content[0].text.value;
        break;
      } else if (runStatus.status === 'failed') {
        throw new Error('Assistant failed to process the request');
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return response;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}