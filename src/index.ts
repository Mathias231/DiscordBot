import discord, { Client } from 'discord.js';
import { config } from 'dotenv';
import openai, { generateMessage, template } from './lib/openai';

// Command Imports
import { clearChat } from './commands/clear';
import { normalConvo } from './test/normalConvo';
import { character } from './lib/character';

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

// Remember to put your BOT Application ID Here.
const botID = '1100333267015712889';

// When bot is ready, log 'Ready!'
client.on('ready', () => {
  console.log('Ready!');
});

// 🩸 Expreimental
client.on('messageCreate', async (msg) => {
  if (botID === msg.author.id) return;
  if (!client.user) return;

  if (msg.content.toLocaleLowerCase().includes(character || `${character}'s`)) {
    await normalConvo(character, msg);
  }
});

// 📚 Commands
client.on('messageCreate', async (msg) => {
  if (!client.user) return;

  // 📝 Clear Command
  if (msg.content.startsWith('!clear')) {
    let content = msg.cleanContent.trim();
    let number = content.slice(7);
    let limit = Number(number);

    // Clearing chat
    await clearChat(limit, msg);
  }

  // 📝 Show Mermory
  if (msg.content.startsWith('!memory')) {
    console.log(msg.content.length);

    // Gets last 10 previous messages
    let previousMessages = (await msg.channel.messages.fetch({
      limit: 10,
    })) as discord.Collection<string, discord.Message>;

    // Stringyfies previous messages
    let stringifiedPreviousMessages = previousMessages
      .map((message) => {
        return `${message.author.username}: ** ${message.cleanContent} **`;
      })
      .reverse()
      .join('\n');

    msg.reply(stringifiedPreviousMessages);
  }
});

// ⚙️ Generating and replies to user when bot is mentioned
client.on('messageCreate', async (msg) => {
  if (!client.user) return;
  if (!msg.mentions.has(client.user.id)) return;

  let content = msg.cleanContent.trim();

  // Reads the last 10 previous comments in chat for context/memory
  const previousMessages = (await msg.channel.messages.fetch({
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
    .replace(new RegExp(`${character}{1,2}:`, 'gi'), '') // Removing 'CharacterName:' from reply | Example removes 'Luigi:' from  'Luigi: Hello user'
    .trim();

  //Sending reply
  msg.reply(reply);
});

client.login(token);
