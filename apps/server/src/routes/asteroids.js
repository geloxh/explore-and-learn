const router  = require('express').Router()
const { getAsteroids } = require('../services/nasaApi')

router.get('/', async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const week  = new Date(Date.now() + 7*86400000).toISOString().split('T')[0]
    const { start = today, end = week } = req.query
    const data = await getAsteroids(start, end)
    res.json(data)
  } catch (err) { next(err) }
})

module.exports = router