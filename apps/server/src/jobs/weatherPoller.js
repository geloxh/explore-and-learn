const Queue  = require('bull')
const prisma = require('../prisma')
const { getSpaceWeather } = require('../services/nasaApi')
const { emitAlert }       = require('../socket')

const weatherQueue = new Queue('space-weather', {
  redis: { host: '127.0.0.1', port: 6379 }
})

weatherQueue.process(async () => {
  console.log('⚡ Polling NASA DONKI...')

  const [flares, cmes, storms] = await Promise.all([
    getSpaceWeather('FLR'),
    getSpaceWeather('CME'),
    getSpaceWeather('GST'),
  ])

  // Save new alerts to DB, skip duplicates via upsert
  for (const flare of flares || []) {
    await prisma.alert.upsert({
      where:  { nasaId: flare.flrID },
      update: {},
      create: {
        type:        'FLR',
        title:       `Solar Flare — Class ${flare.classType}`,
        description: flare.note || 'Solar flare detected by NASA DONKI',
        severity:    flare.classType?.startsWith('X') ? 'high'
                   : flare.classType?.startsWith('M') ? 'medium' : 'low',
        nasaId:      flare.flrID,
        occurredAt:  new Date(flare.beginTime),
      }
    })
  }

  // Broadcast to all WebSocket clients subscribed to alerts
  emitAlert('space-weather', {
    flares: flares?.length ?? 0,
    cmes:   cmes?.length   ?? 0,
    storms: storms?.length ?? 0,
    latest: flares?.[0] ?? null,
  })
})

function startWeatherPoller() {
  // Poll every hour
  weatherQueue.add({}, { repeat: { cron: '0 * * * *' } })
  console.log('⏰ Space weather poller started')
}

module.exports = { startWeatherPoller }