import discord from 'discord.js';

export const clearChat = async (limit: number, msg: discord.Message) => {
  if (!msg) throw new Error();

  let previousMessagesId = (await msg.channel.messages.fetch({
    limit: limit,
    before: msg.id,
  })) as discord.Collection<string, discord.Message>;

  await Promise.all(
    previousMessagesId.map((message) => {
      console.log(message);
      return message.delete();
    }),
  );

  msg.reply(`Cleared ${limit} messages!`);
};
