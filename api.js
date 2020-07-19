const API = require('call-of-duty-api')()
const { SUPPORTED_API } = require('./config')

function mapApiType (type) {
  return SUPPORTED_API[type]
}

function requestApiLogin (username, password) {
  return API.login(username, password)
}

function requestApi (type, gamertag, platform) {
  return mapApiType(type) && API[mapApiType(type)](gamertag, platform)
}

module.exports = {
  requestApi,
  requestApiLogin
}
