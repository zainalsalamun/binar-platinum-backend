const db = require("./db");

async function getAllSliders() {
  try {
    const sliders = await db("sliders").select("*");
    return sliders;
  } catch (error) {
    throw new Error("Error fetching sliders");
  }
}

async function addSlider(gambar_slider, link_slider) {
  try {
    await db("sliders").insert({
      gambar_slider,
      link_slider,
    });
    return "Slider added successfully";
  } catch (error) {
    throw new Error("Error adding slider");
  }
}

async function updateSlider(id, gambar_slider, link_slider) {
  try {
    const updatedRows = await db("sliders")
      .where("id", id)
      .update({ gambar_slider, link_slider });
    if (updatedRows > 0) {
      return "Slider updated successfully";
    } else {
      throw new Error("Slider not found");
    }
  } catch (error) {
    throw new Error("Error updating slider");
  }
}

async function deleteSlider(id) {
  try {
    const deletedRows = await db("sliders").where("id", id).del();
    if (deletedRows > 0) {
      return "Slider deleted successfully";
    } else {
      throw new Error("Slider not found");
    }
  } catch (error) {
    throw new Error("Error deleting slider");
  }
}

module.exports = {
  getAllSliders,
  addSlider,
  updateSlider,
  deleteSlider
};
