const mongoose = require("mongoose");

const containerSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    unique: true
  },

  products: [
    {
      name: String,
      quantity: Number
    }
  ],

  currentLocation: String,
  status: String,

  // 🔥 NEW: Timeline history
  trackingHistory: [
    {
      location: String,
      status: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model("Container", containerSchema);