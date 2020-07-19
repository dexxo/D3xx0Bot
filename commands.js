const { MessageEmbed } = require('discord.js')
const { requestApi, requestApiLogin } = require('./api')
const { PLATFORMS, SUPPORTED_API, BOT_PREFIX } = require('./config')
const { Command } = require('./command')
const user = {}
const commands = [
  new Command({
    name: 'login',
    description: 'login to COD Api',
    usage: `${BOT_PREFIX}login <username> <password>`,
    hasAgrs: true,
    execute: login
  }),
  new Command({
    name: 'help',
    description: 'information',
    usage: `${BOT_PREFIX}help`,
    execute: help
  }),
  new Command({
    name: 'source',
    description: 'set stats source',
    usage: `${BOT_PREFIX}source <source> - e.g: (${Object.keys(
      SUPPORTED_API
    ).join(',')})`,
    hasAgrs: true,
    execute: setSource
  }),
  new Command({
    name: 'platform',
    description: 'set player platform',
    usage: `${BOT_PREFIX}platform <platform> - e.g: (${PLATFORMS.join(',')})`,
    hasAgrs: true,
    execute: setPlatform
  }),
  new Command({
    name: 'playerinfo',
    description: 'gets player info',
    hasAgrs: true,
    usage: `${BOT_PREFIX}playerinfo <gamertag>`,
    execute: getPlayerInfo
  })
]

function help (message) {
  const msgEmbed = new MessageEmbed()
  msgEmbed.setTitle('D3xx0Bot help.')
  msgEmbed.setDescription('Bot commands:')
  commands.forEach(command =>
    msgEmbed.addField(command.name, command.usage || '', true)
  )
  message.channel.send(msgEmbed)
}

function login (message, args) {
  if (this.hasAgrs && !this.hasAgrs.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`
    if (this.usage) {
      reply += `\nThe proper usage would be: \`${this.usage}\``
    }
    return message.channel.send(reply)
  }
  user[message.author.id] = user[message.author.id] || {}
  const username = args[0]
  const password = args[1]
  requestApiLogin(username, password).catch(err => console.log(err))
}

function setPlatform (message, args) {
  if (this.hasAgrs && !this.hasAgrs.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`
    if (this.usage) {
      reply += `\nThe proper usage would be: \`${this.usage}\``
    }
    return message.channel.send(reply)
  }
  user[message.author.id] = user[message.author.id] || {}
  const platform = args[0]
  if (PLATFORMS.indexOf(platform) !== -1) {
    user[message.author.id].platform = platform
  }
}

function setSource (message, args) {
  if (this.hasAgrs && !this.hasAgrs.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`
    if (this.usage) {
      reply += `\nThe proper usage would be: \`${this.usage}\``
    }
    return message.channel.send(reply)
  }
  user[message.author.id] = user[message.author.id] || {}
  const source = args[0]
  const supported = Object.keys(SUPPORTED_API).filter(item => item === source)
  if (supported.length) {
    user[message.author.id].source = source
  }
}

function mapPlayerInfoResponse (type, message, response) {
  const msgEmbed = new MessageEmbed()
  switch (type) {
    case 'wz':
    case 'general': {
      const { title, username, level, lifetime } = response
      msgEmbed.setTitle(`${title.toUpperCase()} ${username} Level:${level}`)
      msgEmbed.setDescription(`${user[message.author.id].source} stats:`)
      // set fields to show
      const brObj = lifetime.mode.br.properties
      Object.keys(brObj).forEach((item, key) => {
        msgEmbed.addField(item, brObj[item], true)
      })
      break
    }
    default: {
      console.log(type, response)
      break
    }
  }
  return msgEmbed
}

function getPlayerInfo (message, args) {
  if (this.hasAgrs && !this.hasAgrs.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`
    if (this.usage) {
      reply += `\nThe proper usage would be: \`${this.usage}\``
    }
    return message.channel.send(reply)
  }
  user[message.author.id] = user[message.author.id] || {}
  const gamertag = args[0]
  if (
    user[message.author.id] &&
    user[message.author.id].platform &&
    user[message.author.id].source
  ) {
    const promiseObj = requestApi(
      user[message.author.id].source,
      gamertag,
      user[message.author.id].platform
    )
    if (promiseObj) {
      promiseObj
        .then(output => {
          message.channel.send(
            mapPlayerInfoResponse(
              user[message.author.id].source,
              message,
              output
            )
          )
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}

module.exports = {
  commands
}
