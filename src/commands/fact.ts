// src/commands/fact.ts

import { Context } from 'telegraf';
import createDebug from 'debug';
import axios from 'axios';

const debug = createDebug('bot:fact_command');

interface FactResponse {
    text: string;
}

const getFact = async (): Promise<string> => {
  try {
    const response = await axios.get<FactResponse>('https://uselessfacts.jsph.pl/random.json?language=en');
    return response.data.text;

  } catch (error) {
    debug('Failed to fetch fact: %o', error);
    return 'Sorry, I couldn\'t dig up an interesting fact right now.';
  }
};

const fact = () => async (ctx:Context) => {
    await ctx.reply('Searching the archives for a fun fact...');
    
    const randomFact = await getFact();
    
    debug(`Triggered "fact" command. Responding with: \n${randomFact}`);
    await ctx.reply(`*Did you know?*\n\n${randomFact}`, { parse_mode: 'Markdown' });
};

export { fact };
