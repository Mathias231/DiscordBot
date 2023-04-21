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

// If bot is ready, log 'Ready!'
client.on('ready', () => {
  console.log('Ready!');
});

// Generating and replies to user when bot is mentioned
client.on('messageCreate', async (msg) => {
  if (!client.user) return;
  if (!msg.mentions.has(client.user.id)) return;
  // replace(/<@\d+>/gi, '');
  let content = msg.cleanContent.trim();

  // Reads the last 10 previous comments in chat for context/memory
  let previousMessages = (await msg.channel.messages.fetch({
    limit: 10,
  })) as discord.Collection<string, discord.Message>;

  // Generating prompt template
  let prompt = template({
    username: msg.author.username,
    previousMessages: previousMessages,
    message: content,
  });
  // console.log(prompt);

  await msg.channel.sendTyping(); // Adding typing event/detail

  // Generating a reply to user
  let reply = (await generateMessage({ prompt: prompt, userId: msg.author.id }))
    .replace(/^\"|\"$/gi, '')
    .replace(/luffy{1,2}:/gi, '')
    .trim();

  //Sending reply
  msg.reply(reply);
});

client.login(token);
