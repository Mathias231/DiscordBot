import discord from 'discord.js';

export interface TemplateParams {
  username: string;
  message: string;
  previousMessages: discord.Collection<string, discord.Message>;
}

export interface GenerateMessageParams {
  prompt: string;
  userId: string;
}
