const express = require('express');
const router = express.Router();
const multer = require('multer');
const Predict = require("../models/predict.model.js");

const {
    createPredict,
    getPredictHistories,
  } = require("../controllers/predict.controller.js");
  
// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });



router.post("/", upload.single('image'), createPredict);
router.get("/", getPredictHistories);

module.exports = router;
