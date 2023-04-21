import * as dotenv from 'dotenv';
import { Bot } from './bot';

dotenv.config();

const bot = new Bot(
    process.env.TOKEN,
    process.env.CLIENT_ID
);

bot.set_commands();
bot.start();
