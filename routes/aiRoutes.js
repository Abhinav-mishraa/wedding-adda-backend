const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST: generate description
router.post("/generate-description", async (req, res) => {
  try {
    const { name, city, capacity } = req.body;

    if (!name || !city || !capacity) {
      return res.status(400).json({ error: "All fields required" });
    }

    const prompt = `Write a short and attractive wedding venue description.

Venue: ${name}
Location: ${city}
Capacity: ${capacity} guests

Keep it elegant and within 3-4 lines.`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      description: response.choices[0].message.content,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

module.exports = router;