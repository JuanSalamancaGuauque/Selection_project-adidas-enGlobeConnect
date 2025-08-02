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


const Feedback = require('./models/Feedback');
const HighlightedComment = require('./models/highlightedComment');

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
  const { location } = req.query;
  const query = location ? { location: new RegExp(location, 'i') } : {};
  const all = await Feedback.find(query).sort({ createdAt: -1 });
  res.json(all);
});


app.get('/api/highlighted', async (req, res) => {
  const { location } = req.query;
  const query = location ? { location: new RegExp(location, 'i') } : {};
  const comments = await HighlightedComment.find(query).sort({ createdAt: -1 });
  res.json(comments);
});


app.post('/api/highlighted', async (req, res) => {
  try {
    const data = new HighlightedComment(req.body);
    await data.save();
    res.status(201).send({ message: 'Comentario destacado guardado' });
  } catch (error) {
    res.status(400).send({ error: 'Error al guardar comentario destacado' });
  }
});


app.listen(4000, () => console.log('Servidor en http://localhost:4000'));