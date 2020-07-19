const { Client, Collection } = require('discord.js')
const { commands } = require('./commands')
const { BOT_PREFIX, BOT_TOKEN } = require('./config')

// bot client
const bot = new Client()
// bot commands collection
const cooldowns = new Collection()
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
  const commandName = args.shift().toLowerCase()

  // check if command exist
  const command = bot.commands.get(commandName)
  if (!command) return

  // check command arguments
  if (command.hasAgrs && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${command.usage}\``
    }
    return message.channel.send(reply)
  }

  // check command cool down
  if (command.cooldown) {
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection())
    }

    const now = Date.now()
    const timestamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown || 3) * 1000

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000
        return message.reply(
          `please wait ${timeLeft.toFixed(
            1
          )} more second(s) before reusing the \`${command.name}\` command.`
        )
      }
    }

    timestamps.set(message.author.id, now)
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
  }

  try {
    command.execute(message, args)
  } catch (e) {
    console.error(e)
    message.reply('there was an error trying to execute that command!')
  }
})

bot.on('error', err => {
  console.error(err)
})

bot.login(BOT_TOKEN)
