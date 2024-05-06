const db = require('../db') 

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

async function getUser() {
  try {
    const users = await db('Users').select('*')
    return users 
  } catch (error) {
    console.error('Error:', error)
    return { success: false, message: 'Failed to get users' }
  } 

}

async function getUserById(id) {
  try {
    const users = await db('Users').where('id', id).first()
    return users
    
  } catch (error) {
    console.error('Error:', error)
    return { success: false, message: 'Failed to get user' }
  }
}

module.exports = { registerUser, loginUser, getUser, getUserById }
