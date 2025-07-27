const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/retail_feedback',
{
    useNewUrlPaser: true, useUnifiedTopology: true
});

const Feedback = require('./models/Feedback');

app.post('/api/feedback', async (req, res) => {
    const data = new Feedback(req.body);
    await data.save();
});

app.get('/api/feedback', async (req, res) => {
    const all = await Feedback.find().sort({createdAt: -1});
    res.json(all);
});