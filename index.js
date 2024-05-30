const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model.js");
const productRoute = require("./routes/product.route.js");
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/products", productRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// conncet database
mongoose
  .connect(
    "mongodb+srv://nursaidahfitria:URDxwZbzi0phPpI8@satakodb.8ftgzlo.mongodb.net/Node-API?retryWrites=true&w=majority&appName=satakoDB"
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Cannot connect to the database!");
  });
