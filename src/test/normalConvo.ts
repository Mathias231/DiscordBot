import discord from 'discord.js';
import { generateMessage, template } from '../lib/openai';

export const normalConvo = async (character: string, msg: discord.Message) => {
  console.log(`I was mentioned by ${msg.author.id}`);

  // Reads the last 10 previous comments in chat for context/memory
  const previousMessages = (await msg.channel.messages.fetch({
    limit: 10,
  })) as discord.Collection<string, discord.Message>;

  // What user said
  let content = msg.cleanContent.trim();

  // Here can a validation be done with OpenAI if content is worth saving -> to database

  //

  // Generating prompt template
  let prompt = template({
    username: msg.author.username,
    previousMessages: previousMessages,
    message: content,
  });

  // Generating a reply to user
  let reply = (await generateMessage({ prompt: prompt, userId: msg.author.id }))
    .replace(/^\"|\"$/gi, '')
    .replace(new RegExp(`${character}{1,2}:`, 'gi'), '') // Removing 'CharacterName:' from reply | Example removes 'Luigi:' from  'Luigi: Hello user'
    .trim();

  await msg.channel.sendTyping(); // Adding typing event/detail

  // Puts a timer on 5 seconds to make it more realistic
  setTimeout(() => {
    return msg.reply(reply);
  }, 5000);
};
