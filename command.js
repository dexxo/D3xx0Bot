function Command ({
  name,
  description,
  execute,
  hasAgrs = false,
  alias = [],
  usage = '',
  guildOnly = false
}) {
  this.name = name
  this.description = description
  this.execute = execute
  this.alias = alias
  this.usage = usage
  this.hasAgrs = hasAgrs
  this.guildOnly = guildOnly
}

module.exports = {
  Command
}
