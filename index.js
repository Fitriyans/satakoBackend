const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();

const app = express();

const Product = require("./models/product.model.js");
const productRoute = require("./routes/product.route.js");
const userRoute = require('./routes/user.route.js');


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/products", productRoute);
app.use('/api', userRoute);



// conncet database
mongoose
  .connect(
    "mongodb+srv://nursaidahfitria:URDxwZbzi0phPpI8@satakodb.8ftgzlo.mongodb.net/Node-API?retryWrites=true&w=majority&appName=satakoDB"
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000, () => {
      console.log("Server is running on port http://localhost:3000");
    });
  })
  .catch(() => {
    console.log("Cannot connect to the database!");
  });
