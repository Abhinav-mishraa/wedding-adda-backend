const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: String,
  capacity: Number,
  price: Number,
  imageUrl: String,
  description: String,
  phone: String,
  mapUrl:String,

});

const Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
