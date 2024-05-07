const userModel = require('../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


async function getUser(req, res) {
  const users = await userModel('Users').select('*')
  return res.json({
    data: users,
  })
}

async function getUserById(req, res) {
  const id = req.params.id
  const user = await userModel('Users').where('id_user', id).first()
  const { username, email, tgl_lahir } = user
  return res.json({
    username,
    email,
    tgl_lahir,
  })
}

async function registerUser(req, res) {
  const { username, password, email, tgl_lahir } = req.body

  if (!username || !password || !email || !tgl_lahir) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'Password must be at least 6 characters' })
  }

  if (await userModel('Users').where('username', username).first()) {
    return res.status(400).json({ message: 'Username already exists' })
  }

  if (await userModel('Users').where('email', email).first()) {
    return res.status(400).json({ message: 'Email already exists' })
  }

  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    await userModel('Users').insert({
      username,
      password: hashedPassword,
      email,
      tgl_lahir,
    })
    return res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to register' })
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body

  const user = await userModel('Users').where('email', email).first()

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password)

  if (!isPasswordMatch) {
    return res.status(401).json({ message: 'Incorrect password' })
  }

  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY)

  if (!token) {
    return res.status(500).json({ message: 'Failed to generate token' })
  }

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      tgl_lahir: user.tgl_lahir,
    },
  })
}

module.exports = { getUser, registerUser, loginUser , getUserById}
