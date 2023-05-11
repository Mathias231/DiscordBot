import { Configuration, OpenAIApi } from 'openai';
import { config } from 'dotenv';
import { character } from './character';
import { GenerateMessageParams, TemplateParams } from '../types/global';

config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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

  // Prompt sent to OpenAI.
  let prompt = `Your reply should be in the style of ${character}.
The previous messages are: 
${stringifiedPreviousMessages} 

The users name is ${username} and he said: "${message}"
Only respond with a message and dont include your name in the response.`;
  return prompt;
};

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
