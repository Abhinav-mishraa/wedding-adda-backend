const express = require("express");
const router = express.Router();
const Venue = require('../models/Venue')


// Create a new venue
router.post("/add", async (req, res) => {
  try {
    const newVenue = new Venue(req.body);
    const savedVenue = await newVenue.save();
    res.status(201).json(savedVenue);
  } catch (error) {
    res.status(500).json({ error: "Failed to add venue" });
  }
});

// Get all venues
router.get("/", async (req, res) => {
  try {
    const venues = await Venue.find();
    console.log("Venues from DB:", venues);
    res.json(venues);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch venues" });
  }
});

module.exports = router;
