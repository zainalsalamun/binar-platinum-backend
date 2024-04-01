const express = require('express');
const app = express();

app.post('/api/users', async (req, res) => {
  const { username, password, email, tgl_lahir } = req.body;
  try {
    await db('Users').insert({ username, password, email, tgl_lahir });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
  
  app.get('/api/users', async (req, res) => {
    try {
      const users = await db('Users').select('*');
      res.json(users);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }

  });
  
  app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password, email, tgl_lahir } = req.body;
    try {
      await db('Users').where('id', id).update({ username, password, email, tgl_lahir });
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  })

  app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db('Users').where('id', id).del();
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  })

  module.exports = app