const router = require('express').Router();

// POST /api/chat — Gemini AI assistant
router.post('/', async (req, res) => {
  const { userMessage } = req.body;
  if (!userMessage) return res.status(400).json({ error: 'Message required' });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: `You are ShareGo's friendly AI assistant. ShareGo is a ride-sharing app where people share rides and split costs.
You help users with:
- How to book or offer rides
- How fare splitting works (base ₹20 + ₹8/km)
- Safety tips for sharing rides
- App features like Women-Only rides, Safety Score, CO2 tracker
- General ride sharing advice
Keep responses short, friendly and helpful. Use emojis occasionally.`
            }]
          },
          contents: [{
            parts: [{ text: userMessage }]
          }]
        })
      }
    );

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) return res.status(500).json({ error: 'No response from AI' });

    res.json({ reply });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'AI service temporarily unavailable' });
  }
});

module.exports = router;