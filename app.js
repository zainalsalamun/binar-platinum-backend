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
const cors = require('cors');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const cloudinary = require('cloudinary').v2;

// app.set('views', './views');


// Port Initiate
const port = 3000;

app.set("view engine", "ejs");
app.use(expresslayouts);
app.use(express.static("public"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use(bodyParser.json());
require('dotenv').config();


cloudinary.config({ 
  cloud_name: 'dacofpkis', 
  api_key: '417969219389821', 
  api_secret: '-mLQe1s2zevxoSF1isuDC0yKBrs' 
});


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
      tgl_lahir: user.tgl_lahir,
      
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

app.post('/api/product-register',async(req,res)=>{
  const {nama_produk,harga,deskripsi,nama_file,kategori,image} = req.body;
  
  await db("products").insert({
    'nama_produk':nama_produk,
    'harga':harga,
    'deskripsi':deskripsi,
    'nama_file':nama_file,
    'kategori':kategori,
    'image':image
  })
  res.redirect('/products')
})

//API Add Product
app.post('/api/product',async(req,res)=>{
  const {nama_produk,harga,deskripsi,nama_file,kategori,image} = req.body;
  
  await db("products").insert({
    'nama_produk':nama_produk,
    'harga':harga,
    'deskripsi':deskripsi,
    'nama_file':nama_file,
    'kategori':kategori,
    'image':image
  })
  res.status(201).json({message:'Product added successfully'})
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
  console.log(products)
  
  return res.json(products)
  
})

// Update product
app.post('/product-register/edit=:id',async(req,res)=>{
  const id = req.params.id
  const {nama_produk,harga,deskripsi,nama_file,kategori,image} = req.body
  await db('products').where('id',id).update({
    'nama_produk':nama_produk,
    'harga':harga,
    'deskripsi':deskripsi,
    'nama_file':nama_file,
    'kategori':kategori,
    'image':image

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


// API Delete Product
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await db("products")
      .where("id", id)
      .del();
    if (deletedProduct) {
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// API Get Detail Product
app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db("products")
      .where("id", id)
      .first();
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error getting product detail:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// API Add Image Slider
app.post("/api/sliders", async (req, res) => {
  const { gambar_slider, link_slider } = req.body;
  try {
    const newSlider = await db("sliders").insert({
      gambar_slider,
      link_slider,
    });
    if (newSlider) {
      res.status(201).json({ message: "Image slider added successfully" });
    } else {
      res.status(400).json({ error: "Failed to add image slider" });
    }
  } catch (error) {
    console.error("Error adding image slider:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// API Edit Slider
app.put("/api/sliders/:id", async (req, res) => {
  const { id } = req.params;
  const { gambar_slider, link_slider } = req.body;
  try {
    const updatedSlider = await db("sliders")
      .where("id", id)
      .update({ gambar_slider, link_slider });
    if (updatedSlider) {
      res.status(200).json({ message: "Image slider edited successfully" });
    } else {
      res.status(404).json({ error: "Image slider not found" });
    }
  } catch (error) {
    console.error("Error editing image slider:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API Delete Slider
app.delete("/api/sliders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSlider = await db("sliders").where("id", id).del();
    if (deletedSlider) {
      res.status(200).json({ message: "Image slider deleted successfully" });
    } else {
      res.status(404).json({ error: "Image slider not found" });
    }
  } catch (error) {
    console.error("Error deleting image slider:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API Get Sliders View
app.get("/api/sliders/view", async (req, res) => {
  try {
    const sliders = await db("sliders").select("*");
    res.status(200).json({ sliders });
  } catch (error) {
    console.error("Error getting sliders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// API Add Category
app.post("/api/categories", async (req, res) => {
  const { title, image_path } = req.body;
  try {
    const newCategory = await db("categories").insert({
      title,
      image_path,
    });
    if (newCategory) {
      res.status(201).json({ message: "Category added successfully" });
    } else {
      res.status(400).json({ error: "Failed to add category" });
    }
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API Update Category
app.put("/api/categories/:id", async (req, res) => {
  const { id } = req.params;
  const { title, image_path } = req.body;
  try {
    const updatedCategory = await db("categories").where("id", id).update({
      title,
      image_path,
    });
    if (updatedCategory) {
      res.status(200).json({ message: "Category updated successfully" });
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// API Get Categories
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await db("categories").select("*");
    res.status(200).json(categories);
    if (!categories) {
      res.status(404).json({ error: "Categories not found" });
    } else {
      res.status(200).json(categories);
    }
    
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }  

  
});



// API Delete Category
app.delete("/api/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await db("categories").where("id", id).del();
    if (deletedCategory) {
      res.status(200).json({ message: "Category deleted successfully" });
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// API Get All Categories
app.get("/api/categories/view", async (req, res) => {
  try {
    const categories = await db("categories").select("*");
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// app.use("/", (req, res) => {
//   res.render("404", {
//     title: "Page Not Found",
//     layout: "layouts/main-layout",
//   });
// });


// multer for upload files
const multer  = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname )
  }
})
const upload = multer({ storage });


// async function uploadToCloudinary(filePath) {
//   let result;
//   try {
//     result = await cloudinary.uploader.upload(filePath, {
//       use_filename: true,
//     });
//     fs.unlinkSync(filePath);
//     return result.url;
//   } catch (error) {
//     console.error("Error uploading file to Cloudinary:", error);
//     return null;
//   }
// }


async function uploadToCloudinary(filePath) {
  let result;
  try {
    result = await cloudinary.uploader.upload(filePath, {
      use_filename: true,
    });
    fs.unlinkSync(filePath);
    return result.url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    return null;
  }
}




app.post('/api/cloudinary', upload.single('avatar'), async (req, res) => {
  const url = await uploadToCloudinary(req.file.path);
  if (url) {
    return res.json({
      message: 'File uploaded successfully',
      url : url,
    });
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
      return res.status(400).json({ error: "Please select a file" });
    }

    res.status(200).json({ message: "File uploaded successfully", file: req.file });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})


// API upload photo
app.post('/api/photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please select a photo" });
    }
    res.status(200).json({ message: "Photo uploaded successfully", file: req.file });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})




app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
