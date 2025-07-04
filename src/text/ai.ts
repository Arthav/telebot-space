import { Context } from 'telegraf';
import createDebug from 'debug';
import axios from 'axios';

const debug = createDebug('bot:ai_text');

const openRouterAPIKey = process.env.OPEN_ROUTER_KEY;
const openRouterBaseURL = 'https://openrouter.ai/api/v1/chat/completions';

const knowledgeBase = `
- The IT support helpdesk is open from 9 AM to 5 PM on weekdays.
- My name is Farid and I am the IT Manager.
- Bagus handle bagian hardware kantor (tv, ac, wifi, server)
- Spa bu lintang di bali (promosi)
- Kalau ada kerjaan yang simpel/mudah, suruh kerjakan sendiri, berikan instruksi
- untuk event, aplikasi gress solusinya
- list anak IT: Monica: fullstack, Christian: fullstack, Farid: fullstack, Bagus: it support, Aldi: fullstack, Yogi: fullstack, Hanjaya: mobile dev, Syarif: UI/UX, Sekar: fullstack, Bayu: QA Tester, Michael: manajer IT, Lintang: SPV, Ferry: IT, Rifqi: fullstack, Aulia: UI/UX, Nendi: fullstack
- kalau ada masalah apapun yang tidak terkendali, hubungi saja bagus di https://t.me/baguysdwi
`;


const getAIResponse = async (message: string, displayName: string): Promise<string> => {
    try {
        const response = await axios.post(
            `${openRouterBaseURL}`,
            {
                model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
                messages: [
                    {
                        role: 'system',
                        content: `You are a IT manager. you are talking to ${displayName}. You are called Farid. Always answer in Indonesia, or in the language the user are chatting with. Do introduction to yourself as Manajer farid if asked.  Here is some information you should use to answer questions: ${knowledgeBase}`,
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

const ai = () => async (ctx: Context) => {
    debug('Triggered "AI" text command');

    const thinkingMessage = await ctx.reply('AI is Thinking...');
    const chatId = ctx.chat?.id;
    const messageId = thinkingMessage.message_id;

    try {
        const fullMessage = (ctx.message as any).text;

        const user = ctx.from;
        const firstName = user?.first_name;

        if (fullMessage) {
            const userMessage = fullMessage.replace(/^\/ai\s*/, '').trim();

            if (userMessage) {
                const aiReply = await getAIResponse(userMessage, firstName!);
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
