import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:command');

const command = () => async (ctx: Context) => {
  const userName = `${ctx.message?.from.first_name} ${ctx.message?.from.last_name}`;
  const messageList = [
    `/about - About Bot`,
    `/joke - Show random joke`,
    `/fact - Show random fact`,
  ].join('\n');
  const message = `Hello, ${userName}!\n\n${messageList}`;

  debug(`Triggered "command" command with message \n${message}`);
  await ctx.reply(message);
};

export { command };
