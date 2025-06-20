import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:joke_command');

const joke = () => async (ctx: Context) => {
  const message = `Why don’t skeletons fight each other? They don’t have the guts.`;
  debug(`Triggered "joke" command with message \n${message}`);
  await ctx.reply(message);
};

export { joke };
