import { Context } from 'telegraf';
import createDebug from 'debug';
import axios from 'axios';

const debug = createDebug('bot:joke_command');

interface Joke {
  error: boolean;
  category: string;
  type: 'single' | 'twopart';
  joke?: string;
  setup?: string;
  delivery?: string;
}

const getJoke = async (): Promise<string> => {
  try {
    const response = await axios.get<Joke>('https://v2.jokeapi.dev/joke/Any?safe-mode');
    const jokeData = response.data;

    if (jokeData.error) {
      debug('API returned an error: %o', jokeData);
      return 'Sorry, I couldn\'t fetch a joke right now. Please try again later.';
    }

    if (jokeData.type === 'single' && jokeData.joke) {
      return jokeData.joke;
    } else if (jokeData.type === 'twopart' && jokeData.setup && jokeData.delivery) {
      return `${jokeData.setup}\n\n${jokeData.delivery}`;
    } else {
      debug('Received an unexpected joke format: %o', jokeData);
      return 'I got a weird joke format. Let me try to fix my wires.';
    }

  } catch (error) {
    debug('Failed to fetch joke from API: %o', error);
    return 'Oops! Something went wrong while I was thinking of a joke.';
  }
};


const joke = () => async (ctx: Context) => {
  await ctx.reply('Thinking of a good one...');

  const randomJoke = await getJoke();

  debug(`Triggered "joke" command. Responding with: \n${randomJoke}`);
  await ctx.reply(randomJoke);
};

export { joke };