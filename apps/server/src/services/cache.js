const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 })

const getCache = (key)           => cache.get(key)
const setCache = (key, val, ttl) => cache.set(key, val, ttl)
const delCache = (key)           => cache.del(key)

module.exports = { getCache, setCache, delCache }