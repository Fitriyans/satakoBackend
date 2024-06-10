const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const Predict = require("../models/predict.model");
const getDiseaseInfo = require('../utils/diseaseInfo');

// Load TensorFlow model
let model;
(async () => {
    model = await tf.loadLayersModel('file://model/model.json');
})();

const createPredict = async (req, res) => {
    if (!model) {
        return res.status(500).send('Model is not loaded yet');
    }

    const filePath = req.file.path;

    // Load image and preprocess
    const imageBuffer = fs.readFileSync(filePath);
    const imageTensor = tf.node.decodeImage(imageBuffer).expandDims();

    // Make prediction
    const predictions = model.predict(imageTensor);
    const predictedClass = predictions.argMax(-1).dataSync()[0];
    // const confidence = predictions.max().dataSync()[0];

    // Get additional info based on the predicted class
    const diseaseInfo = getDiseaseInfo(predictedClass);

    // Save prediction to MongoDB
    const prediction = new Prediction({
        image: filePath,
        disease: diseaseInfo.name,
        description: diseaseInfo.description,
        causes: diseaseInfo.causes,
        solutions: diseaseInfo.solutions
    });

    await prediction.save();

    res.json(prediction);
};

module.exports = {
    createPredict
};
