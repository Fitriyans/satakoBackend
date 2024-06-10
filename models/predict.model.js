const mongoose = require("mongoose");

const PredictSchema = mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    causes: {
      type: Number,
      required: true,
    },
    solutions: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Predict = mongoose.model("Predict", PredictSchema);
module.exports = Predict;
