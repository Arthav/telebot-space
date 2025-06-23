// src/commands/news.ts

import { Context } from 'telegraf';
import createDebug from 'debug';
import axios from 'axios';

const debug = createDebug('bot:news_command');

const API_KEY = process.env.NEWS_API_KEY;

interface Article {
  title: string;
  source: {
    name: string;
  };
  url: string;
}

// Define the structure of the main API response
interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

const getTopHeadlines = async (): Promise<string> => {
  // Check if the API key is available
  if (!API_KEY) {
    debug('News API Key is not configured.');
    return 'Sorry, the news service is not set up correctly by the admin.';
  }

  // API endpoint for top headlines in Indonesia. We'll fetch the top 5.
  const url = `https://newsapi.org/v2/top-headlines?country=id&pageSize=5&apiKey=${API_KEY}`;

  try {
    const response = await axios.get<NewsResponse>(url);
    const { articles, totalResults } = response.data;

    if (totalResults === 0 || articles.length === 0) {
      return 'I couldn\'t find any top headlines for Indonesia right now.';
    }

    // Format the articles into a clean, readable list
    let formattedNews = '*🇮🇩 Top 5 Trending News in Indonesia*\n\n';
    articles.forEach((article, index) => {
      // Clean title from source name if it's there (e.g., "Title - SourceName")
      const cleanTitle = article.title.split(` - ${article.source.name}`)[0].trim();
      
      formattedNews += `*${index + 1}. ${cleanTitle}*\n`;
      formattedNews += `   - _Source: ${article.source.name}_\n`;
      formattedNews += `   - [Read More](${article.url})\n\n`;
    });

    return formattedNews;

  } catch (error: any) {
    debug('Error fetching news data: %o', error.response?.data || error.message);
    if (error.response?.data?.code === 'apiKeyInvalid') {
         return 'The news service API key is invalid. Please notify the admin.';
    }
    return 'Oops! Something went wrong while fetching the news. Please try again later.';
  }
};

const news = () => async (ctx: Context) => {
  await ctx.reply('📰 Fetching the latest headlines for you...');

  const latestNews = await getTopHeadlines();

  debug('Triggered "news" command.');

  try {
    await ctx.replyWithMarkdown(latestNews, { disable_web_page_preview: true });
  } catch (e) {
     debug('Error sending markdown news: %o', e);
     await ctx.reply(latestNews.replace(/[*_`[\]()~>#+\-=|{}.!]/g, '\\$&'));
  }
};

export { news };
