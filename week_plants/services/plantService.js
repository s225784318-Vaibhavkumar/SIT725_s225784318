const Plant = require('../models/plantModel');

// Get all plants
const getAllPlants = async () => {
  return await Plant.find();
};

// Get single plant by ID
const getPlantById = async (id) => {
  return await Plant.findOne({ id: id });
};

// Create new plant
const createPlant = async (plantData) => {
  const plant = new Plant(plantData);
  return await plant.save();
};

// Update plant
const updatePlant = async (id, updateData) => {
  return await Plant.findOneAndUpdate({ id: id }, updateData, { new: true });
};

// Delete plant
const deletePlant = async (id) => {
  return await Plant.findOneAndDelete({ id: id });
};

module.exports = {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant
};
