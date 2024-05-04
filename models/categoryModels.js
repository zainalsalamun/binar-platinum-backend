const db = require("../db");

async function getAllCategories() {
  try {
    const categories = await db("categories").select("*");
    return categories;
  } catch (error) {
    throw new Error("Error fetching categories");
  }
}

async function addCategory(title, image_path) {
  try {
    await db("categories").insert({
      title,
      image_path,
    });
    return "Category added successfully";
  } catch (error) {
    throw new Error("Error adding category");
  }
}

async function updateCategory(id, title, image_path) {
  try {
    const updatedRows = await db("categories")
      .where("id", id)
      .update({ title, image_path });
    if (updatedRows > 0) {
      return "Category updated successfully";
    } else {
      throw new Error("Category not found");
    }
  } catch (error) {
    throw new Error("Error updating category");
  }
}

async function deleteCategory(id) {
  try {
    const deletedRows = await db("categories").where("id", id).del();
    if (deletedRows > 0) {
      return "Category deleted successfully";
    } else {
      throw new Error("Category not found");
    }
  } catch (error) {
    throw new Error("Error deleting category");
  }
}

module.exports = {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory
};
