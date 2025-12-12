const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth'); // NEW

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // NEW

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Connect DB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.listen(process.env.PORT, () => {
  console.log(`Fortress API listening on ${process.env.PORT}`);
});
