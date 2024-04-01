const express = require('express');
const app = express();


app.post('/api/register', async (req, res) => {
    try {
      const { username, password, repeat_password, email, tgl_lahir } = req.body;
  
      const existingUser = users.find(user => user.username === username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = {
        id: users.length + 1,
        username,
        password: hashedPassword,
        repeat_password: hashedPassword,
        email,
        tgl_lahir
      };
      users.push(newUser);
  

      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });



  module.exports = app