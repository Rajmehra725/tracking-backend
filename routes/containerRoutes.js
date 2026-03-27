const express = require("express");
const router = express.Router();
const Container = require("../models/Container");

// Tracking ID generate
const generateTrackingId = () => {
  return "TRK" + Date.now();
};

router.post("/create", async (req, res) => {
  try {
    const trackingId = generateTrackingId();

    const container = new Container({
      trackingId,
      products: req.body.products,

      currentLocation: "Bhopal",
      status: "Dispatched",

      // ✅ First entry
      trackingHistory: [
        {
          location: "Bhopal",
          status: "Dispatched"
        }
      ]
    });

    await container.save();

    res.json({
      message: "Container Created",
      trackingId
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/update/:id", async (req, res) => {
  try {
    const container = await Container.findOne({
      trackingId: req.params.id
    });

    if (!container) {
      return res.status(404).json({ message: "Not found" });
    }

    container.currentLocation = req.body.location;
    container.status = req.body.status;

    // safety check
    if (!container.trackingHistory) {
      container.trackingHistory = [];
    }

    container.trackingHistory.push({
      location: req.body.location,
      status: req.body.status
    });

    await container.save();

    res.json({ message: "Updated + History Added" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/bulk-update", async (req, res) => {
  const { location, status } = req.body;

  await Container.updateMany(
    {},
    {
      $set: {
        currentLocation: location,
        status: status,
      },
      $push: {
        history: { location, status },
      },
    }
  );

  res.json({ message: "All updated successfully" });
});
router.get("/track/:id", async (req, res) => {
  try {
    const container = await Container.findOne({
      trackingId: req.params.id
    });

    if (!container) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({
      trackingId: container.trackingId,
      currentLocation: container.currentLocation,
      status: container.status,
      history: container.trackingHistory
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/all", async (req, res) => {
  try {
    const containers = await Container.find().sort({ createdAt: -1 });

    res.json(containers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;