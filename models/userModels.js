const db = require('../db') // Assuming db.js contains the database connection

// Function to register a new user
async function registerUser(username, password, email, tgl_lahir) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await db('Users').insert({
      username,
      password: hashedPassword,
      email,
      tgl_lahir,
    })
    return { success: true, message: 'User registered successfully' }
  } catch (error) {
    console.error('Error registering user:', error)
    return { success: false, message: 'Failed to register user' }
  }
}

// Function to authenticate user login
async function loginUser(email, password) {
  try {
    const user = await db('Users').where('email', email).first()
    if (!user) {
      return { success: false, message: 'User not found' }
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return { success: false, message: 'Incorrect password' }
    }
    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        tgl_lahir: user.tgl_lahir,
      },
    }
  } catch (error) {
    console.error('Error logging in user:', error)
    return { success: false, message: 'Failed to login user' }
  }
}

module.exports = { registerUser, loginUser }
