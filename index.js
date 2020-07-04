const { Client, MessageEmbed, EmbedField } = require('discord.js')
const {
  token,
  prefix,
  adminUserID,
  supportedPlatforms
} = require('./config.json')
const bot = new Client()
const API = require('call-of-duty-api')()

const user = {}

bot.on('ready', () => {
  console.log('This bot is online!!!')
})

bot.on('message', message => {
  if (message.content.charAt(0) !== prefix || message.author.bot) return

  const args = message.content.slice(prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()
  user[message.author.id] = user[message.author.id] || {}

  console.log(user, command, args)

  if (message.author.id === adminUserID) {
    // admin comands
    switch (command) {
      case 'server':
        message.guild &&
          message.reply(`This server's name is: ${message.guild.name}`)
        break
    }
  }

  switch (command) {
    case 'login':
      user[message.author.id].username = args[0]
      user[message.author.id].password = args[1]
      API.login(
        user[message.author.id].username,
        user[message.author.id].password
      )
        .then(res => console.log(res))
        .catch(err => console.log(err))
      break
    case 'platform':
      if (supportedPlatforms.indexOf(args[0]) !== -1) {
        user[message.author.id].platform = args[0]
      } else {
        message.reply(`Unsupported platform: ${args[0]}`)
      }
      break
    case 'playerinfo': {
      const gamerTag = args[0]
      if (user[message.author.id] && user[message.author.id].platform) {
        API.MWstats(gamerTag, API.platforms[user[message.author.id].platform])
          .then(output => {
            const { title, username, level, lifetime } = output
            const msgEmbed = new MessageEmbed()
            msgEmbed.setTitle(`${title.toUpperCase()} ${username} Level:${level}`)
            msgEmbed.setDescription('Battle Royale stats:')

            // set fields to show
            const brObj = lifetime.mode.br.properties
            Object.keys(brObj).forEach((item, key) => {
              msgEmbed.addField(item, brObj[item], true)
            })

            message.channel.send(msgEmbed)
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        message.reply('set platform before... (!plaform <plaform_name>)')
      }

      break
    }
    default:
      break
  }
})

bot.login(token)
