import { Context } from 'telegraf';
import createDebug from 'debug';
import axios from 'axios';

const debug = createDebug('bot:quote_command');

interface QuoteResponse {
  content: string;
  author: string;
}

const getQuote = async (): Promise<string> => {
  try {
    const response = await axios.get<QuoteResponse>('https://api.quotable.io/random');
    const { content, author } = response.data;
    
    return `"${content}"\n— ${author}`;
    
  } catch (error) {
    debug('Failed to fetch quote: %o', error);
    return 'Could not fetch a quote at this moment. Please try again.';
  }
};

const quote = () => async (ctx: Context) => {
  await ctx.reply('Finding some words of wisdom...');
  
  const randomQuote = await getQuote();
  
  debug(`Triggered "quote" command. Responding with: \n${randomQuote}`);
  await ctx.reply(randomQuote);
};

export { quote };
