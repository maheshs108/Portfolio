# Personal Portfolio Website

A modern, responsive portfolio website built with HTML, CSS, and JavaScript. Features a clean design, smooth animations, and an excellent user experience.

## Direct link for running

**1. Run from your computer (no server)**  
Copy this link and paste it in Chrome’s address bar, then press Enter (use your actual project folder path if different):

```
file:///C:/Users/A/Desktop/Myportfolio/index.html
```

Or: open the project folder and **double-click `index.html`** to open the portfolio in your browser.

---

**2. Run with a local server**  
In the project folder, run in the terminal:

```bash
npx serve
```

Then open this direct link in Chrome:

```
http://localhost:3000
```

(If the terminal shows a different port, use that URL instead.)

---

**3. Run online (Render – free, works on any device)**  
1. Go to [render.com](https://render.com) and sign in with GitHub.  
2. **New → Static Site** → connect repo **maheshs108/Portfolio**.  
3. **Build command:** leave empty (or `echo done`). **Publish directory:** `.`  
4. **Create Static Site**. Wait 1–2 minutes.  
5. Open the URL Render gives you (e.g. `https://portfolio-xxxx.onrender.com`) — it works on any device.

## Features

- 🎨 **Modern Design** - Clean, professional layout with gradient accents
- 📱 **Fully Responsive** - Works perfectly on all devices (mobile, tablet, desktop)
- ✨ **Smooth Animations** - Scroll animations, typing effect, and hover interactions
- 🎯 **Interactive Elements** - Dynamic navigation, project cards, and contact form
- 🚀 **Performance Optimized** - Fast loading with optimized animations
- 💼 **Portfolio Showcase** - Display your projects with beautiful cards
- 📬 **Contact Form** - Functional contact section with validation
- 🎭 **Typing Effect** - Auto-typing animation for multiple roles
- 🌐 **Social Links** - Connect via GitHub, LinkedIn, Twitter, and Email

## Sections

1. **Hero Section** - Eye-catching introduction with typing effect
2. **About Section** - Tell your story with stats and description
3. **Skills Section** - Showcase your technical skills by category
4. **Projects Section** - Display your work with interactive cards
5. **Contact Section** - Easy way for people to reach you
6. **Footer** - Professional closing with navigation

## How to Run This Program

**Main entry:** Open the portfolio root `index.html` (this folder).

### Option 1: Open directly in Chrome (or any browser)
1. Go to the project folder: `C:\Users\A\Desktop\Myportfolio` (or wherever you cloned it).
2. Double-click **`index.html`**, or right-click → **Open with** → **Google Chrome** (or Edge, Firefox, etc.).
3. No build or server required—it runs as a static site.

### Option 2: Run with a local server (recommended for projects)
- **VS Code:** Install the "Live Server" extension, right-click `index.html` → **Open with Live Server**. The site opens in your default browser (e.g. Chrome).
- **Command line:** From the project root run:
  ```bash
  npx serve
  ```
  Then open the URL shown (e.g. `http://localhost:3000`) in Chrome.

**Individual project apps** (TaskMaster, WeatherNow, Netflix clone, etc.) are under `projects/<app-name>/`. Open `projects/<app-name>/index.html` in Chrome the same way, or use Live Server from that folder.

---

## Quick Start

1. **Clone or download** this portfolio
2. **Customize the content**:
   - Open `index.html` and replace placeholder text with your information
   - Update your name, bio, skills, and projects
   - Add your social media links
   - Replace contact information with yours

3. **Add your images** (optional):
   - Replace the placeholder icons with your profile photo
   - Add screenshots of your projects

4. **Open in browser**:
   - Simply open `index.html` in any modern web browser (e.g. Chrome)
   - No build process or dependencies required!

## Customization Guide

### Colors
Edit the CSS variables in `styles.css` to change the color scheme:
```css
:root {
    --primary-color: #6366f1;
    --primary-dark: #4f46e5;
    --primary-light: #818cf8;
    --secondary-color: #f59e0b;
}
```

### Content

**Hero Section:**
- Line 24: Update your name
- Lines 27-32: Change the typing text array in `script.js`
- Line 34: Update your tagline

**About Section:**
- Lines 62-78: Update your bio and stats
- Line 80: Add link to your resume

**Skills Section:**
- Lines 94-149: Add/remove/modify your skills

**Projects Section:**
- Lines 159-293: Update project details, links, and technologies

**Contact Section:**
- Lines 309-325: Update your contact information

### Adding Real Images

Replace the placeholder divs with actual images:

```html
<!-- Replace this: -->
<div class="image-placeholder">
    <i class="fas fa-user"></i>
</div>

<!-- With this: -->
<img src="path/to/your/image.jpg" alt="Description">
```

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)** - Interactive features and animations
- **Font Awesome** - Icons (CDN)
- **React + Vite** (optional) - Component-based portfolio in `portfolio-react/`
- **Node.js + Express** (optional) - Contact API in `server/`

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Opera (latest)

## File Structure

```
portfolio/
├── index.html          # Static portfolio (open in browser)
├── styles.css
├── script.js
├── portfolio-react/    # React (Vite) version with APIs
│   ├── src/
│   │   ├── api/        # github.js, contact.js, weather.js
│   │   └── components/
│   └── ...
├── server/             # Node.js API (contact form)
│   ├── index.js
│   └── package.json
├── projects/           # Demo apps (TaskMaster, Weather, etc.)
└── README.md
```

## Who sees what — only you see private information

- **On other people’s devices:** When someone opens your portfolio (e.g. your live site or `index.html`), they only see the **public portfolio** — hero, about, skills, projects, contact form. Nothing else.
- **On your account / your device:** Only you can see private information:
  - **Owner-only page:** Open `owner.html` in your browser and enter the password you set there. In `owner.html`, change the password from `change-me` to a password only you know. This page is **not linked** from the portfolio, so visitors never see it. Use it to remind yourself where contact messages go (your backend or email). Keep the URL (`owner.html`) and password private.
  - **Contact form messages:** When visitors submit the form, messages go to your backend or email — they are never shown on the public site. Only you see them (e.g. in your server logs or inbox).

**Summary:** Visitors only see the portfolio website. All private information (owner page, form submissions) is only visible to you on your account; do not link `owner.html` from the site and do not share its password.

## Privacy & safety — don’t share private or risky things

- **Never put in code or in the repo:** API keys, passwords, secret tokens, or any real credentials. This project does not use any of these; it only uses public APIs (GitHub, Open-Meteo) that don’t need keys.
- **If you add secrets later:** Use environment variables (e.g. `.env`) and keep `.env` in `.gitignore` (it’s already there). Set secrets only in your deployment platform’s “Environment variables” section, not in the code.
- **Contact info:** Email, phone, and address in the portfolio are visible to anyone who opens the site. If you don’t want them public, replace them with placeholders (e.g. “your.email@example.com”) before deploying.
- **Deploy only on trusted platforms:** Use official, well-known free services such as **GitHub Pages**, **Netlify**, **Vercel**, or **Render**. Avoid unknown or untrusted sites that could be risky with your data or repo.

## Deployment (free, trusted platforms only)

### GitHub Pages (Free)
1. Create a GitHub repository and push your code.
2. Go to **Settings → Pages**.
3. Select the main branch as source.
4. Your site will be live at `https://yourusername.github.io/repository-name`.

### Netlify (Free)
1. Sign up at [netlify.com](https://netlify.com).
2. Connect your GitHub repo or drag-and-drop your portfolio folder.
3. Your site is live. Do not paste any API keys or passwords in the dashboard unless you use Netlify’s “Environment variables” for secrets.

### Vercel (Free)
1. Sign up at [vercel.com](https://vercel.com).
2. Import your GitHub repository.
3. Deploy. Use Vercel’s “Environment variables” for any secrets; never put them in the code.

### Render (Free)
1. Sign up at [render.com](https://render.com).
2. Connect your GitHub repo and create a **Static Site**.
3. Set build command to empty and publish directory to `.` (root). Use Render’s “Environment” only for secrets; never commit them.

## Tips for Personalization

1. **Professional Photo**: Use a high-quality, professional headshot
2. **Real Projects**: Add 3-6 of your best projects with actual screenshots
3. **Resume**: Create a PDF resume and link it in the About section
4. **Contact Form**: For a working form, integrate with:
   - [Formspree](https://formspree.io/) (easy, free tier available)
   - [EmailJS](https://www.emailjs.com/) (send emails from client-side)
   - Your own backend

5. **Analytics**: Add Google Analytics to track visitors
6. **SEO**: Update meta tags in the `<head>` section for better search visibility

## Customization Ideas

- Add a dark mode toggle
- Include a blog section
- Add testimonials from clients/colleagues
- Create an experience/timeline section
- Add certifications and education
- Include a downloadable resume
- Add more animation effects
- Integrate with a CMS for easy updates

## License

Free to use for personal and commercial projects. Attribution appreciated but not required.

## Support

If you need help customizing your portfolio:
1. Check the comments in the code files
2. Refer to this README
3. Search for tutorials on specific features

## Credits

Created with ❤️ using vanilla HTML, CSS, and JavaScript.

---

**Made by Mahesh Suryawanshi**
