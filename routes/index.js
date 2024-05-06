const router = require('express').Router()
const categoryRoutes = require('./categoryRoutes')
const productRoutes = require('./productRoutes')
const sliderRoutes = require('./sliderRoutes')
const userRoutes = require('./userRoutes')
const orderRoutes = require('./orderRoutes')

router.use('/api/categories/', categoryRoutes)
router.use('/api/products', productRoutes)
router.use('/api/sliders/view', sliderRoutes)
router.use('/api/users/', userRoutes)
router.use('/api/orders', orderRoutes)
router.use('/api', userRoutes)

module.exports = router
