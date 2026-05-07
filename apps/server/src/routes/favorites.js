const router = require('express').Router()
const prisma = require('../prisma')

// Save a favorite
router.post('/', async (req, res, next) => {
  try {
    const { userId, type, refId, data, note } = req.body
    const fav = await prisma.favorite.create({
      data: { userId, type, refId, data: JSON.stringify(data), note }
    })
    res.status(201).json(fav)
  } catch (err) { next(err) }
})

// Get all favorites for a user
router.get('/:userId', async (req, res, next) => {
  try {
    const favs = await prisma.favorite.findMany({
      where: { userId: parseInt(req.params.userId) },
      orderBy: { createdAt: 'desc' }
    })
    // Parse JSON data field back to object
    res.json(favs.map(f => ({ ...f, data: JSON.parse(f.data) })))
  } catch (err) { next(err) }
})

// Delete a favorite
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.favorite.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

module.exports = router