const fetch = require('node-fetch')
const { getCache, setCache } = require('./cache')

const KEY = process.env.NASA_API_KEY || 'DEMO_KEY'
const TAP = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync'

async function cachedFetch(cacheKey, url, ttlSeconds = 3600) {
  const cached = getCache(cacheKey)
  if (cached) return cached

  const res  = await fetch(url)
  if (!res.ok) throw new Error(`NASA API error: ${res.status} ${url}`)
  const data = await res.json()

  setCache(cacheKey, data, ttlSeconds)
  return data
}

// Asteroids
async function getAsteroids(startDate, endDate) {
  const url = `https://api.nasa.gov/neo/rest/v1/feed`
    + `?start_date=${startDate}&end_date=${endDate}&api_key=${KEY}`
  return cachedFetch(`asteroids:${startDate}:${endDate}`, url, 1800)
}

// Natural events
async function getNaturalEvents(limit = 20, status = 'open') {
  const url = `https://eonet.gsfc.nasa.gov/api/v3/events?limit=${limit}&status=${status}`
  return cachedFetch(`events:${limit}:${status}`, url, 900)
}

// Mars rover photos
async function getMarsPhotos(rover = 'curiosity', sol = 1000, camera = '') {
  let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`
    + `?sol=${sol}&api_key=${KEY}`
  if (camera) url += `&camera=${camera}`
  return cachedFetch(`mars:${rover}:${sol}:${camera}`, url, 86400)
}

// Mars latest photos (no sol filter)
async function getMarsLatest(rover = 'curiosity') {
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos`
    + `?api_key=${KEY}`
  return cachedFetch(`mars:latest:${rover}`, url, 3600)
}

// Space weather (DONKI)
async function getSpaceWeather(type = 'FLR') {
  const today   = new Date().toISOString().split('T')[0]
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
  const url = `https://api.nasa.gov/DONKI/${type}`
    + `?startDate=${weekAgo}&endDate=${today}&api_key=${KEY}`
  return cachedFetch(`weather:${type}:${today}`, url, 3600)
}

// Exoplanets (TAP)
async function getExoplanets({ minRadius=0, maxRadius=30,
  minTemp=0, maxTemp=10000, method='', limit=500 } = {}) {

  let where = `default_flag=1`
    + ` AND pl_rade>${minRadius} AND pl_rade<${maxRadius}`
    + ` AND pl_eqt>${minTemp}   AND pl_eqt<${maxTemp}`
  if (method) where += ` AND discoverymethod like '${method}'`

  const adql = `SELECT pl_name,pl_rade,pl_masse,pl_eqt,pl_orbper,`
    + `pl_insol,disc_year,discoverymethod,hostname,sy_dist`
    + ` FROM ps WHERE ${where} ORDER BY pl_name ASC`

  const url = `${TAP}?query=${encodeURIComponent(adql)}&format=json&maxrec=${limit}`
  const cacheKey = `exoplanets:${minRadius}:${maxRadius}:${minTemp}:${maxTemp}:${method}`
  return cachedFetch(cacheKey, url, 86400) // cache 24h (data rarely changes)
}

module.exports = {
  getAsteroids, getNaturalEvents, getMarsPhotos,
  getMarsLatest, getSpaceWeather, getExoplanets
}