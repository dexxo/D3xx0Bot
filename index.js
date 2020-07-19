const { Client, Collection } = require('discord.js')
const { commands } = require('./commands')
const { BOT_PREFIX, BOT_TOKEN } = require('./config')

// bot client
const bot = new Client()
// bot commands collection
bot.commands = new Collection()
// set commands
commands.forEach(command => bot.commands.set(command.name, command))

bot.on('ready', () => {
  console.log('This bot is online!!!')
})

bot.on('message', message => {
  // do not response to bot message or message that starts with prefix
  if (!message.content.startsWith(BOT_PREFIX) || message.author.bot) return

  const args = message.content
    .slice(BOT_PREFIX.length)
    .trim()
    .split(/ +/)
  const command = args.shift().toLowerCase()

  // check if command exist
  if (!bot.commands.has(command)) return

  try {
    bot.commands.get(command).execute(message, args)
  } catch (e) {
    console.error(e)
    message.reply('there was an error trying to execute that command!')
  }
})

bot.on('error', err => {
  console.error(err)
})

bot.login(BOT_TOKEN)
