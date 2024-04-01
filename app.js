// Module Import
const express = require("express");
const expresslayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const db = require("./db");
const app = express();
app.use(express.json());
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cosr = require('cors');
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cosr());


// const express = require('express');
// const app = express();

// const db = require('./db');

// app.use(express.json());
// app.set('view engine', 'ejs');
// app.set('views', './views');


// Port Initiate
const port = 3000;
// // Middleware & View Engine
app.set("view engine", "ejs");
app.use(expresslayouts);
app.use(express.static("Public"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use(bodyParser.json());
require('dotenv').config();


app.get('/api/users', async (req, res) => {
  const users = await db('Users').select('*');
  return res.json({
      data:users
  });

})
app.post('/api/register', async (req, res) => {
  const { username, password, email, tgl_lahir } = req.body;

  if (!username || !password || !email || !tgl_lahir) {
      return res.status(400).json({ message: 'All fields are required' });
  }
  if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  if (await db('Users').where('username', username).first()) {
      return res.status(400).json({ message: 'Username already exists' });
  }

  if (await db('Users').where('email', email).first()) {
      return res.status(400).json({ message: 'Email already exists' });
  }

  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
      return res.status(400).json({ message: 'Invalid email address' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  try{
      await db('Users').insert({
          username,
          password:hashedPassword,
          email,
          tgl_lahir
      })
      return res.status(201).json({message:"User registered successfully"})
  }catch(err){
      return res.status(500).json({message:"Failed to register"})

  }
  
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body; 

  const user = await db('Users').where('email', email).first(); 

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);

  if (!token) {
    return res.status(500).json({ message: 'Failed to generate token' });
  }

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      tgl_lahir: user.tgl_lahir
    }
  });
});


// Middleware for token verification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
      return res.status(403).json({ message: 'Token is required' });
  }
  try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.userId = decoded.userId;
      next();
  } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
  }
};


// Protected route
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route' });
});


// Module & Routing
app.get("/", async (req, res) => {
  console.log('masuk')
  const importProducts = await db("products")
    .select("*")
    .orderBy("nama_produk", "asc")
    .limit(5);
    console.log('masuk2')
  const productRaw = JSON.stringify(importProducts);
  const products = JSON.parse(productRaw);
  res.render("index", {
    title: "Best Home Furniture in Town",
    layout: "layouts/main-layout",
    products,
  });
});

app.get("/add-product",(req,res)=>{
  res.render('add-product',{
    layout : 'layouts/main-layout',
    title : 'Add New Product'
  })
})

app.post('/product-register',async(req,res)=>{
  const {nama_produk,harga,deskripsi,nama_file} = req.body;
  
  await db("products").insert({
    'nama_produk':nama_produk,
    'harga':harga,
    'deskripsi':deskripsi,
    'nama_file':nama_file
  })
  res.redirect('/product-register')
})

//menambahkan edit
app.get('/product-register/edit=:id',async(req,res)=>{
  const id = req.params.id
  const importProducts = await db("products")
    .select("*")
    .where("id", id)
    .first();
  const productRaw = JSON.stringify(importProducts);
  const products = JSON.parse(productRaw);
  res.render('product-edit',{
    layout : 'layouts/main-layout',
    title : 'Edit Product',
    products
  })
})

//API view produk
app.get('/api/products',async(req,res)=>{
  const products = await db('products').select('*');
  return res.json({
    data:products
  })
  
})

// Update product
app.post('/product-register/edit=:id',async(req,res)=>{
  const id = req.params.id
  const {nama_produk,harga,deskripsi,nama_file} = req.body
  await db('products').where('id',id).update({
    'nama_produk':nama_produk,
    'harga':harga,
    'deskripsi':deskripsi,
    'nama_file':nama_file
  })
  res.redirect('/product-register')
})


app.get("/products", async (req, res) => {
  const importProducts = await db("products")
    .select("*")
    .orderBy("nama_produk", "asc");
  const productRaw = JSON.stringify(importProducts);
  const products = JSON.parse(productRaw);
  res.render("products", {
    title: "Best Home Furniture in Town",
    layout: "layouts/main-layout",
    products,
  });
});

app.get("/product-register", async (req, res) => {
  const importProducts = await db("products")
    .select("*")
    .orderBy("id", "asc");
  const productRaw = JSON.stringify(importProducts);
  const products = JSON.parse(productRaw);
  res.render("product-register", {
    title: "Edit Produk",
    layout: "layouts/main-layout",
    products,
  });
});

// GET Detail product
app.get("/product-register=:id", async (req, res) => {
  const id = req.params.id;
  const importProducts = await db("products")
    .select("*")
    .where("id", id)
    .first();
  const productRaw = JSON.stringify(importProducts);
  const products = JSON.parse(productRaw);
  res.render("product-detail", {
    title: `${products.nama_produk}`,
    layout: "layouts/main-layout",
    products,
  });
});

// Delete product
app.get("/product-register/delete=:id", async (req, res) => {
  const id = req.params.id;
  await db("products").where("id", id).del();
  res.redirect('/product-register')
});

// app.use("/", (req, res) => {
//   res.render("404", {
//     title: "Page Not Found",
//     layout: "layouts/main-layout",
//   });
// });

// App Listener
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
