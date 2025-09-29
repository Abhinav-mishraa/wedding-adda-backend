 

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load .env

const feedback = require('./routes/feedback');
 
 

const app = express();
const PORT = process.env.PORT || 5000;
 

// ✅ Middleware (should be before routes)
app.use(cors());
app.use(express.json());
  

const feedbackRoutes = require('./routes/feedback');
app.use("/api/feedback", feedbackRoutes);



const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
// ✅ Routes
const venueRoutes = require("./routes/venueRoutes");
app.use("/api/venues", venueRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Wedding Adda backend is running!");
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
