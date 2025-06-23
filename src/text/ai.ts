import { Context } from 'telegraf';
import createDebug from 'debug';
import axios from 'axios';

const debug = createDebug('bot:ai_text');

const openRouterAPIKey = process.env.OPEN_ROUTER_KEY; 
const openRouterBaseURL = 'https://openrouter.ai/api/v1/chat/completions';

// Function to make API call to OpenRouter
const getAIResponse = async (message: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${openRouterBaseURL}`,
      {
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterAPIKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    debug('Error calling OpenRouter API:', error);
    return 'Sorry, I could not generate a response at the moment.';
  }
};

// Function to handle the AI response
const ai = () => async (ctx: Context) => {
  debug('Triggered "AI" text command');

  const fullMessage = (ctx.message as any).text;

  if (fullMessage) {
    const userMessage = fullMessage.replace(/^\/ai\s*/, '').trim();

    if (userMessage) {
      const aiReply = await getAIResponse(userMessage);
      await ctx.reply(aiReply);
    } else {
      await ctx.reply('Please provide a message.');
    }
  }
};

export { ai };
