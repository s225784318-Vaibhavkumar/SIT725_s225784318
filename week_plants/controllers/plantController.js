const plantService = require('../services/plantService');

// Get all plants
const getAllPlants = async (req, res) => {
  try {
    const plants = await plantService.getAllPlants();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single plant by ID
const getPlantById = async (req, res) => {
  try {
    const plant = await plantService.getPlantById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    res.json(plant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new plant
const createPlant = async (req, res) => {
  try {
    const newPlant = await plantService.createPlant(req.body);
    res.status(201).json(newPlant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update plant
const updatePlant = async (req, res) => {
  try {
    const updatedPlant = await plantService.updatePlant(req.params.id, req.body);
    if (!updatedPlant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    res.json(updatedPlant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete plant
const deletePlant = async (req, res) => {
  try {
    const deletedPlant = await plantService.deletePlant(req.params.id);
    if (!deletedPlant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    res.json({ message: 'Plant deleted successfully', plant: deletedPlant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant
};
