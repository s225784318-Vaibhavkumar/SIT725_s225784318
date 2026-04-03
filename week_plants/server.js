const express = require('express');
const mongoose = require('mongoose');

const PORT = 3004;

// 1. Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/plantsDB');

mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB');
});

// 2. App + middleware
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 3. Routes (MVC)
const plantRoutes = require('./routes/plantRoute');

app.use('/api/plants', plantRoutes);

// Integrity check
app.get('/api/_integrity-check', (_req, res) => res.sendStatus(204));

// 4. Root
app.get('/', (_req, res) => res.send('Welcome to the Plants Management API!'));

// 5. 404 + error handlers
app.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

// 6. Start
app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
