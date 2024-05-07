const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderControllers');

router.get('/', sliderController.getAllSliders);
router.post('/', sliderController.addSlider);
router.put('/:id', sliderController.updateSlider);
router.delete('/:id', sliderController.deleteSlider);

module.exports = router;
