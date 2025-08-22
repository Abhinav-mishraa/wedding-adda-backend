const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware
const Venue = require('../models/Venue'); // Adjust path as needed

// Public route - Get all venues (no auth needed)
router.get('/', async (req, res) => {
    try {
        const venues = await Venue.find().populate('owner', 'name email');
        res.json({
            success: true,
            venues
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Protected route - Create venue (auth required)
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, location, price, amenities } = req.body;
        
        // Create new venue with logged-in user as owner
        const venue = new Venue({
            name,
            description,
            location,
            price,
            amenities,
            owner: req.user._id // Set the logged-in user as owner
        });

        await venue.save();
        
        res.status(201).json({
            success: true,
            message: 'Venue created successfully',
            venue
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Protected route - Update venue (only owner can update)
router.put('/:id', auth, async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        
        if (!venue) {
            return res.status(404).json({
                success: false,
                message: 'Venue not found'
            });
        }
        
        // Check if user is the owner
        if (venue.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this venue'
            });
        }
        
        const updatedVenue = await Venue.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        res.json({
            success: true,
            venue: updatedVenue
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;