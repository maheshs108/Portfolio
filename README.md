# Personal Portfolio Website

A modern, responsive portfolio website built with HTML, CSS, and JavaScript. Features a clean design, smooth animations, and an excellent user experience.

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
   - Simply open `index.html` in any modern web browser
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
- **Font Awesome** - Beautiful icons (loaded via CDN)

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Opera (latest)

## File Structure

```
portfolio/
│
├── index.html          # Main HTML file
├── styles.css          # All styles and animations
├── script.js           # JavaScript functionality
└── README.md           # Documentation (this file)
```

## Deployment

### GitHub Pages (Free)
1. Create a GitHub repository
2. Push your code to the repository
3. Go to Settings → Pages
4. Select main branch as source
5. Your site will be live at `https://yourusername.github.io/repository-name`

### Netlify (Free)
1. Sign up at [netlify.com](https://netlify.com)
2. Drag and drop your portfolio folder
3. Your site is live instantly!

### Vercel (Free)
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy with one click

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
