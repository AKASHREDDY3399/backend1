const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to database
mongoose.connect('mongodb://localhost/nutriTrack', { useNewUrlParser: true, useUnifiedTopology: true });

// Models
const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String,
    progress: Array
}));
const Meal = mongoose.model('Meal', new mongoose.Schema({
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
}));

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.send('User registered successfully');
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Meal Routes
app.post('/api/meals', async (req, res) => {
    const meal = new Meal(req.body);
    await meal.save();
    res.send('Meal added successfully');
});

app.get('/api/meals', async (req, res) => {
    const meals = await Meal.find();
    res.json(meals);
});

// Progress Tracking
app.post('/api/progress', async (req, res) => {
    const { username, progress } = req.body;
    await User.findOneAndUpdate({ username }, { progress }, { new: true });
    res.send('Progress updated successfully');
});

// Nutritional Data
app.get('/api/nutrition', (req, res) => {
    res.json({ message: 'Nutritional data endpoint' });
});

// Recommendations
app.get('/api/recommendations', (req, res) => {
    res.json({ message: 'Recommendations endpoint' });
});

// Admin Features
app.get('/api/admin/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});