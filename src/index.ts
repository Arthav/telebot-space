import { Telegraf } from 'telegraf';

import { about, joke, quote, command, fact } from './commands';
import { greeting, ai } from './text';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);

bot.command('about', about());
bot.command('joke', joke());
bot.command('quote', quote());
bot.command('fact', fact());
bot.command('command', command());
bot.command('help', command());
bot.on('message', ai());

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
