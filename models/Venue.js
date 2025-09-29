 

const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String },        // optional
    location: { type: String, required: true },  
    capacity: { type: Number },           // optional
    price: { type: Number, required: true },
    phone: { type: String },              // optional
    mapUrl: { type: String },             // optional
    imageUrl: { type: String },           // single image URL
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // from auth middleware
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Venue', venueSchema);
