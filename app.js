const express = require('express')
const expresslayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const db = require('./db')
const app = express()
app.use(express.json())
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
const cloudinary = require('cloudinary').v2
const fs = require ('fs');
const https = require ('https')

//HTTPS OPTIONS
// const httpsOptions = {
//   key: fs.readFileSync('/etc/ssl/private/selfsigned.key'),
//   cert: fs.readFileSync('/etc/ssl/certs/selfsigned.crt')
// };

//HTTPS SERVER
// const server = https.createServer(httpsOptions, app);

//SWAGGER
const swaggerUi = require('swagger-ui-express')
const apiDocumentation = require('./apidocs.json')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocumentation))
//END SWAGGER

// app.set('views', './views');

// Luki
const router = require('./routes')

app.use(router)

// Port Initiate
const port = process.env.PORT

//Middlewares
app.set('view engine', 'ejs')
app.use(expresslayouts)
app.use(express.static('public'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())
require('dotenv').config()

// Cloudinary config
cloudinary.config({
  cloud_name: 'process.env.CLOUD_NAME',
  api_key: 'process.env.API_KEY',
  api_secret: 'process.env.API_SECRET',
})

// Middleware Token verification
const authMiddleware = require('./middlewares/authMiddleware')

// Protected route
app.get('/api/protected', authMiddleware.verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route' })
})

//Upload multer and Cloudinary

// multer for upload files
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})
const upload = multer({ storage })

async function uploadToCloudinary(filePath) {
  let result
  try {
    result = await cloudinary.uploader.upload(filePath, {
      use_filename: true,
    })
    fs.unlinkSync(filePath)
    return result.url
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error)
    return null
  }
}

async function uploadToCloudinary(filePath) {
  let result
  try {
    result = await cloudinary.uploader.upload(filePath, {
      use_filename: true,
    })
    fs.unlinkSync(filePath)
    return result.url
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error)
    return null
  }
}

app.post('/api/cloudinary', upload.single('avatar'), async (req, res) => {
  const url = await uploadToCloudinary(req.file.path)
  if (url) {
    return res.json({
      message: 'File uploaded successfully',
      url: url,
    })
  } else {
    return res.json({
      message: 'Failed to upload file',
    })
  }
})

// API upload files
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please select a file' })
    }

    res
      .status(200)
      .json({ message: 'File uploaded successfully', file: req.file })
  } catch (error) {
    console.error('Error uploading file:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// API upload photo
app.post('/api/photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please select a photo' })
    }
    res
      .status(200)
      .json({ message: 'Photo uploaded successfully', file: req.file })
  } catch (error) {
    console.error('Error uploading photo:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

server = app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})