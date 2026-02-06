/**
 * Portfolio API - Node.js/Express backend
 * - POST /api/contact - Contact form (saves to console; add nodemailer for real email)
 * - Optional: proxy for GitHub/Weather if you want to hide keys (not required for public APIs)
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true }));
app.use(express.json());

// Contact form - receives data from React and responds
// In production: add nodemailer, SendGrid, or Formspree backend
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }
  // Log (in production you would send email or save to DB)
  console.log('Contact form:', { name, email, subject, message });
  res.json({ success: true, message: 'Thank you! Your message has been received.' });
});

// Health check for proxy
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Portfolio API running at http://localhost:${PORT}`);
});
