import { Configuration, OpenAIApi } from 'openai';
import { config } from 'dotenv';
import discord from 'discord.js';

config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

interface TemplateParams {
  username: string;
  message: string;
  previousMessages: discord.Collection<string, discord.Message>;
}

export const template = ({
  username,
  message,
  previousMessages,
}: TemplateParams) => {
  let stringifiedPreviousMessages = previousMessages
    .map((message) => {
      return `${message.author.username}: ${message.cleanContent}`;
    })
    .reverse()
    .join('\n');

  let prompt = `You ARE the character Luffy from One Piece and you must answer
The previous messages are: 
${stringifiedPreviousMessages} 

The users name is ${username} and he said: "${message}"
Only respond with a message.`;
  return prompt;
};

interface GenerateMessageParams {
  prompt: string;
  userId: string;
}

export const generateMessage = async ({
  prompt,
  userId,
}: GenerateMessageParams) => {
  let response = await openai.createChatCompletion({
    messages: [
      {
        name: userId,
        content: prompt,
        role: 'system',
      },
    ],
    model: 'gpt-3.5-turbo',
  });
  let message = response.data.choices[0].message?.content;
  if (!message) throw new Error();

  return message;
};

export default openai;
