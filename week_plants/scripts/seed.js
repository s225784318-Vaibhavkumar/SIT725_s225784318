const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/plantsDB');

const Plant = require('../models/plantModel');

const samplePlants = [
  {
    id: 'p1',
    name: 'Rose',
    type: 'flowering',
    price: '15.99',
    currency: 'AUD',
    wateringFrequency: 'daily',
    sunlight: 'full sun',
    height: '60'
  },
  {
    id: 'p2',
    name: 'Sunflower',
    type: 'flowering',
    price: '12.50',
    currency: 'AUD',
    wateringFrequency: 'weekly',
    sunlight: 'full sun',
    height: '150'
  },
  {
    id: 'p3',
    name: 'Cactus',
    type: 'succulent',
    price: '8.99',
    currency: 'AUD',
    wateringFrequency: 'bi-weekly',
    sunlight: 'full sun',
    height: '30'
  },
  {
    id: 'p4',
    name: 'Basil',
    type: 'herb',
    price: '4.50',
    currency: 'AUD',
    wateringFrequency: 'daily',
    sunlight: 'partial shade',
    height: '45'
  },
  {
    id: 'p5',
    name: 'Fern',
    type: 'foliage',
    price: '10.00',
    currency: 'AUD',
    wateringFrequency: 'weekly',
    sunlight: 'full shade',
    height: '80'
  },
  {
    id: 'p6',
    name: 'Tulip',
    type: 'flowering',
    price: '9.75',
    currency: 'AUD',
    wateringFrequency: 'weekly',
    sunlight: 'partial shade',
    height: '55'
  },
  {
    id: 'p7',
    name: 'Mint',
    type: 'herb',
    price: '3.99',
    currency: 'AUD',
    wateringFrequency: 'daily',
    sunlight: 'partial shade',
    height: '35'
  }
];

(async () => {
  try {
    await Plant.collection.createIndex({ id: 1 }, { unique: true });
    await Plant.deleteMany({});
    await Plant.insertMany(samplePlants);
    console.log('✅ Seeded 7 plants successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();
