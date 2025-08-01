const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/retail_feedback')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error de conexión:', err));

const Feedback = require('./models/feedback');

app.post('/api/feedback', async (req, res) => {
  try {
    const data = new Feedback(req.body);
    await data.save();
    res.status(201).send({ message: 'Feedback recibido' });
  } catch (error) {
    res.status(400).send({ error: 'Error al guardar feedback' });
  }
});


app.get('/api/feedback', async (req, res) => {
  const all = await Feedback.find().sort({ createdAt: -1 });
  res.json(all);
});

app.listen(4000, () => console.log('Servidor en http://localhost:4000'));