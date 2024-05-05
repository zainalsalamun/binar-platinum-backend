const router = require('express').Router()
const categoryRoutes = require('./categoryRoutes')
const productRoutes = require('./productRoutes')
const sliderRoutes = require('./sliderRoutes')
const userRoutes = require('./userRoutes')

router.use('/api/categories/', categoryRoutes)
router.use('/api/products', productRoutes)
router.use('/api/sliders/view', sliderRoutes)
router.use('/api/', userRoutes)

module.exports = router
