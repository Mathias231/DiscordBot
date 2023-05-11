import { Configuration, OpenAIApi } from 'openai';
import { config } from 'dotenv';
import { character, franchise, personality } from './character';
import { GenerateMessageParams, TemplateParams } from '../types/global';

config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// ⚙️🤖 Creating THE final template that is sent to OpenAi.
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
She is from ${franchise}.
Their personalities are: ${personality}

The previous messages are: 
${stringifiedPreviousMessages}

The users name is ${username} and he said: "${message}"
Remember to keep the reply simple and easy.`;
  return prompt;
};

// ⚙️🤖 Generates the response and replies back to user
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
