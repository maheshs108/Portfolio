/**
 * Contact form API - sends to Node.js backend.
 * Set VITE_API_URL in .env (e.g. http://localhost:5000) or leave empty for same-origin.
 */

// In dev, Vite proxies /api to backend; in production set VITE_API_URL to your API origin
const API_BASE = import.meta.env.VITE_API_URL ?? '';

export async function submitContactForm({ name, email, subject, message }) {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, subject, message }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to send message');
  }
  return res.json();
}
