# Project

This is a discord bot I made for myself about a character named Luffy from One Piece. My goal for this bot is to make the bot talk and act like Luffy in a discord server when he is mentioned.

For this project I'm using OpenAI to generate a template of him and his replies to all users.

### Requirements

- You need to have an OpenAI Account
- Your own discord bot

# Getting started
1. Clone repository
```
git clone https://github.com/Mathias231/DiscordBot.git
```

2. Open code in Visual Studio Code or any other coding program
```
cd DiscordBot
code .
```

3. Open terminal and run the following code
```
npm i
```

4. Create .env file in root folder and add the following code
```
DISCORD_TOKEN=
OPENAI_API_KEY=
```
5. Add your secret discord & OpenAI Keys to .env
6. Run the code in your terminal
```
npm run dev
```

## Change Character
1. Locate folder **lib** and open file character.ts
2. Change text from `Luigi from Super Mario` to any other character

Note that you can also add the franchise name to better specify where your character are from.
