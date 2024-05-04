const axios = require('axios');

// Get the base URL from environment variables
const baseURL = process.env.BASE_URL || 'http://localhost:3030';

//"registerUser" Controller function to handle user registration
async function registerUser(req, res) {
    try {
      const { username, password, repeat_password, email, tgl_lahir } = req.body;
  
      // Validation
      if (!username || !password || !repeat_password || !email || !tgl_lahir) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      if (password !== repeat_password) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }
  
      // Call the register API
      const response = await axios.post(`${baseURL}/api/register`, {
        username,
        password,
        repeat_password,
        email,
        tgl_lahir
      });
  
      // Handle different response status codes
      if (response.status === 201) {
        return res.status(201).json(response.data);
      } else {
        return res.status(500).json({ message: 'Internal server error' });
      }
    } catch (error) {
      // Handle Axios errors
      console.error('Error registering user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

//"loginUser" Controller function to handle login user
async function loginUser(req, res) {
    try {
      const { username, password } = req.body;
  
      // Validation
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      // Call the login API
      const response = await axios.post(`${baseURL}/api/login`, {
        username,
        password
      });
  
      // Handle different response status codes
      if (response.status === 200) {
        return res.status(200).json(response.data);
      } else if (response.status === 401) {
        return res.status(401).json({ message: 'Incorrect username or password' });
      } else {
        return res.status(500).json({ message: 'Internal server error' });
      }
    } catch (error) {
      // Handle Axios errors
      console.error('Error logging in user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

module.exports = { registerUser, loginUser };