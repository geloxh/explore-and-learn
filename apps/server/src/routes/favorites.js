const router = require('express').Router()
const prisma = require('../prisma')

// Get user favorites
router.get('/:userId', async (req, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: parseInt(req.params.userId) }
    })
    res.json(favorites)
  } catch (err) { next(err) }
})

// Add favorite
router.post('/', async (req, res, next) => {
  try {
    const { userId, type, refId, data, note } = req.body
    const favorite = await prisma.favorite.create({
      data: { userId, type, refId, data, note }
    })
    res.json(favorite)
  } catch (err) { next(err) }
})

// Delete favorite
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.favorite.delete({
      where: { id: parseInt(req.params.id) }
    })
    res.json({ success: true })
  } catch (err) { next(err) }
})

module.exports = router