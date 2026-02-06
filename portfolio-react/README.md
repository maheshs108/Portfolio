# Portfolio – React + APIs

React (Vite) version of the portfolio with **GitHub API**, **Weather API**, and **Node.js contact backend**.

## Run locally

1. Start the API (from repo root):
   ```bash
   cd server && npm install && npm start
   ```
2. In another terminal, start the React app:
   ```bash
   cd portfolio-react && npm install && npm run dev
   ```
3. Open the URL shown (e.g. http://localhost:5173) in Chrome.

## APIs (no keys required)

- **GitHub** – Profile avatar and repos (see `src/api/github.js`).
- **Open-Meteo** – Weather for Maharashtra (see `src/api/weather.js`).
- **Contact** – Form posts to `server`; set `VITE_API_URL` in production.

## Build

```bash
npm run build
```

Output in `dist/`. Deploy anywhere; point `VITE_API_URL` to your API if needed.
