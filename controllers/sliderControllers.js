const sliderModel = require("./sliderModels");

async function getAllSliders(req, res) {
  try {
    const sliders = await sliderModel.getAllSliders();
    res.json(sliders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addSlider(req, res) {
  const { gambar_slider, link_slider } = req.body;
  try {
    const message = await sliderModel.addSlider(gambar_slider, link_slider);
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateSlider(req, res) {
  const id = req.params.id;
  const { gambar_slider, link_slider } = req.body;
  try {
    const message = await sliderModel.updateSlider(id, gambar_slider, link_slider);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteSlider(req, res) {
  const id = req.params.id;
  try {
    const message = await sliderModel.deleteSlider(id);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllSliders,
  addSlider,
  updateSlider,
  deleteSlider
};
