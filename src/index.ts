import { error } from 'console';
import discord, { Client } from 'discord.js';
import { config } from 'dotenv';
import openai, { generateMessage, template } from './lib/openai';

// Dotenv token from .env
config();
const token = process.env.DISCORD_TOKEN;

// Creating new Client
const client = new Client({
  intents: [
    'Guilds',
    'GuildMessages',
    'GuildMessageReactions',
    'GuildMessageTyping',
    'DirectMessages',
    'DirectMessageReactions',
    'DirectMessageTyping',
    'MessageContent',
  ],
});

client.on('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate', (msg) => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.on('messageCreate', async (msg) => {
  if (!client.user) return;
  if (!msg.mentions.has(client.user.id)) return;
  // replace(/<@\d+>/gi, '');
  let content = msg.cleanContent.trim();

  let previousMessages = (await msg.channel.messages.fetch({
    limit: 10,
  })) as discord.Collection<string, discord.Message>;

  let prompt = template({
    username: msg.author.username,
    previousMessages: previousMessages,
    message: content,
  });
  console.log(prompt);

  await msg.channel.sendTyping();

  let reply = (await generateMessage({ prompt: prompt, userId: msg.author.id }))
    .replace(/^\"|\"$/gi, '')
    .replace(/luffy{1,2}:/gi, '')
    .trim();

  msg.reply(reply);
});

client.login(token);
