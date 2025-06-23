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
                        role: 'system',
                        content: 'You are a helpful assistant. Always answer in English, or in the language the user are chatting with',
                    },
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

    await ctx.reply('AI is Thinking...');
    const chatId = ctx.chat?.id;
    const messageId = ctx.message?.message_id;

    try {
        const fullMessage = (ctx.message as any).text;

        if (fullMessage) {
            const userMessage = fullMessage.replace(/^\/ai\s*/, '').trim();

            if (userMessage) {
                const aiReply = await getAIResponse(userMessage);
                await ctx.reply(aiReply);
            } else {
                await ctx.reply('Please provide a message after the /ai command.');
            }
        }
    } catch (error) {
        debug('Error in AI handler:', error);
        await ctx.reply('An error occurred while processing your request.');
    } finally {
        try {
            await ctx.telegram.deleteMessage(chatId!, messageId!);
        } catch (deleteError) {
            debug('Failed to delete "thinking" message:', deleteError);
        }
    }
};

export { ai };
