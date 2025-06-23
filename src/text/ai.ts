import { Context } from 'telegraf';
import createDebug from 'debug';
import axios from 'axios';

const debug = createDebug('bot:ai_text');

const openRouterAPIKey = process.env.OPEN_ROUTER_KEY; 
const openRouterBaseURL = 'https://openrouter.ai/api/v1';

// Function to make API call to OpenRouter
const getAIResponse = async (message: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${openRouterBaseURL}/chat`,
      {
        message: message,
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterAPIKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.response;
  } catch (error) {
    debug('Error calling OpenRouter API:', error);
    return 'Sorry, I could not generate a response at the moment.';
  }
};

// Function to handle the AI response
const ai = () => async (ctx: Context) => {
  debug('Triggered "AI" text command');

  const userMessage = ctx.text;
  
  if (userMessage) {
    const aiReply = await getAIResponse(userMessage);

    await ctx.reply(aiReply);
  }
};

export { ai };
