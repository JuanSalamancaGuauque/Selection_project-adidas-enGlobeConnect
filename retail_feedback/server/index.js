const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/retail_feedback')

const Feedback = require('./models/Feedback');

app.post('/api/feedback', async (req, res) => {
    try{
    const data = new Feedback(req.body);
    await data.save();
    res.status(201).send({message: 'save'});
} catch (error){
    res.status(400).send({message: 'error'});
}
});

app.get('/api/feedback', async (req, res) => {
    const all = await Feedback.find().sort({createdAt: -1});
    res.json(all);
});