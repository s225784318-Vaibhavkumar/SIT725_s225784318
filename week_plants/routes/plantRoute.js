const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');

// Get all plants
router.get('/', plantController.getAllPlants);

// Get single plant by ID
router.get('/:id', plantController.getPlantById);

// Create new plant
router.post('/', plantController.createPlant);

// Update plant
router.put('/:id', plantController.updatePlant);

// Delete plant
router.delete('/:id', plantController.deletePlant);

module.exports = router;
