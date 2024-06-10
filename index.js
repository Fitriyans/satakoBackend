const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const Product = require("./models/product.model.js");
const productRoute = require("./routes/product.route.js");
const Predict = require("./models/predict.model.js");
const predictRoute = require("./routes/predict.route.js");
const userRoute = require('./routes/user.route.js');

const port = process.env.PORT || 3000;


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// routes
app.use("/api/products", productRoute);
app.use("/api/predict", predictRoute);
app.use('/api', userRoute);



// conncet database
mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(port, () => {
      console.log("Server is running on port http://localhost:3000");
    });
  })
  .catch(() => {
    console.log("Cannot connect to the database!");
  });
