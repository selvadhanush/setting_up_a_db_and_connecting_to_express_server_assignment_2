const express = require('express');
const { resolve } = require('path');
const User =require('./schema');
const mongoose = require('mongoose');
require ('dotenv').config();

const app = express();
const port = 3010;
app.use(express.json())

app.use(express.static('static'));

mongoose.connect(process.env.MONGO_URI)
.then(()=>
  console.log('conneted to database'))
.catch(err=>
  console.log('Error connecting to database',err));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/api/users', async (req, res) => {
  try {
      const { name, email, password } = req.body;
      
    
      const newUser = new User({ name, email, password });
      await newUser.save();

      res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
      console.error('Error saving user:', error.errors);
      if(error.name=="ValidationError"){
       return res.status(400).json({message:`validation error check the key`})
      }
      
      res.status(500).json({ message:error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
