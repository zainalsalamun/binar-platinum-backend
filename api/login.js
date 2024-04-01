const express = require('express');
const app = express();

app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = users.find(user => user.username === username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
  
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  



  module.exports = app 