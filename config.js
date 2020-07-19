module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  BOT_PREFIX: process.env.BOT_PREFIX,
  ADMIN_ID: process.env.ADMIN_ID,
  PLATFORMS: ['psn', 'steam', 'xbl', 'battle', 'uno'],
  SUPPORTED_API: {
    mpcombat: 'MWcombatmp',
    mp: 'MWmp',
    wz: 'MWwz',
    general: 'MWstats'
  }
}
