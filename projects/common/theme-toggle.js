/**
 * Universal Theme Toggle System
 * Provides dark/light mode switching for all apps
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        // Load saved theme
        this.loadTheme();
        
        // Create toggle button if it doesn't exist
        if (!document.getElementById('themeToggle')) {
            this.createToggleButton();
        }
        
        // Apply theme
        this.applyTheme(this.currentTheme);
        
        // Setup listeners
        this.setupListeners();
    }

    createToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'themeToggle';
        toggleBtn.className = 'theme-toggle';
        toggleBtn.setAttribute('aria-label', 'Toggle theme');
        toggleBtn.innerHTML = `
            <i class="fas fa-moon theme-icon-dark"></i>
            <i class="fas fa-sun theme-icon-light"></i>
        `;
        document.body.appendChild(toggleBtn);
        
        // Add styles
        this.addToggleStyles();
    }

    addToggleStyles() {
        if (document.getElementById('themeToggleStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'themeToggleStyles';
        style.textContent = `
            .theme-toggle {
                position: fixed;
                bottom: 2rem;
                left: 2rem;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: none;
                background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
                color: white;
                cursor: pointer;
                box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                overflow: hidden;
                position: relative;
            }

            .theme-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 40px rgba(99, 102, 241, 0.5);
            }

            .theme-toggle:active {
                transform: scale(0.95);
            }

            .theme-icon-dark,
            .theme-icon-light {
                position: absolute;
                font-size: 1.5rem;
                transition: all 0.3s ease;
            }

            body:not(.dark-mode) .theme-icon-dark {
                opacity: 1;
                transform: translateY(0) rotate(0deg);
            }

            body:not(.dark-mode) .theme-icon-light {
                opacity: 0;
                transform: translateY(30px) rotate(180deg);
            }

            body.dark-mode .theme-icon-dark {
                opacity: 0;
                transform: translateY(-30px) rotate(-180deg);
            }

            body.dark-mode .theme-icon-light {
                opacity: 1;
                transform: translateY(0) rotate(0deg);
            }

            body.dark-mode .theme-toggle {
                background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%);
                box-shadow: 0 8px 30px rgba(245, 158, 11, 0.4);
            }

            /* Smooth theme transition */
            body {
                transition: background-color 0.3s ease, color 0.3s ease;
            }

            * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .theme-toggle {
                    bottom: 1rem;
                    left: 1rem;
                    width: 50px;
                    height: 50px;
                }
                
                .theme-icon-dark,
                .theme-icon-light {
                    font-size: 1.2rem;
                }
            }

            /* Animation on theme change */
            @keyframes themeChange {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }

            .theme-toggle.changing {
                animation: themeChange 0.5s ease;
            }
        `;
        document.head.appendChild(style);
    }

    setupListeners() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('userTheme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }

        // Keyboard shortcut: Ctrl/Cmd + Shift + D
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.saveTheme(newTheme);

        // Add animation
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.classList.add('changing');
            setTimeout(() => toggleBtn.classList.remove('changing'), 500);
        }

        // Show notification
        this.showThemeNotification(newTheme);
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            document.documentElement.setAttribute('data-theme', 'light');
        }

        // Dispatch custom event for apps that need to update
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('userTheme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.currentTheme = 'dark';
            }
        }
    }

    saveTheme(theme) {
        localStorage.setItem('userTheme', theme);
    }

    showThemeNotification(theme) {
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${theme === 'dark' ? '#1F2937' : '#FFFFFF'};
            color: ${theme === 'dark' ? '#F9FAFB' : '#1F2937'};
            padding: 1rem 2rem;
            border-radius: 50px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            z-index: 10001;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideDown 0.3s ease;
        `;
        
        const icon = theme === 'dark' ? '🌙' : '☀️';
        const text = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
        notification.innerHTML = `${icon} ${text} activated`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Add notification animations
const animStyle = document.createElement('style');
animStyle.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(animStyle);

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeManager = new ThemeManager();
    });
} else {
    window.themeManager = new ThemeManager();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
