import { useState, useEffect } from 'react';

const ROLES = [
  'Full-Stack Developer',
  'UI/UX Designer',
  'Problem Solver',
  'Creative Thinker',
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[roleIndex];
    const delay = isDeleting ? 50 : 100;
    if (!isDeleting && text.length === current.length) {
      const id = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(id);
    }
    if (isDeleting && text.length === 0) {
      setRoleIndex((i) => (i + 1) % ROLES.length);
      setIsDeleting(false);
      return;
    }
    const id = setTimeout(
      () => setText(isDeleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1)),
      delay
    );
    return () => clearTimeout(id);
  }, [roleIndex, text, isDeleting]);

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Hi, I'm <span className="highlight">Mahesh Suryawanshi</span>
          </h1>
          <p className="hero-subtitle">
            <span className="typed-text">{text}</span>
            <span className="cursor">&nbsp;</span>
          </p>
          <p className="hero-description">
            I create beautiful and functional digital experiences that make a difference.
          </p>
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">View My Work</a>
            <a href="#contact" className="btn btn-secondary">Get in Touch</a>
          </div>
          <div className="social-links">
            <a href="https://github.com/maheshs108" target="_blank" rel="noreferrer" aria-label="GitHub">
              <i className="fab fa-github" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter" />
            </a>
            <a href="mailto:surywanshim786@gmail.com" aria-label="Email">
              <i className="fas fa-envelope" />
            </a>
          </div>
        </div>
      </div>
      <div className="scroll-down">
        <a href="#about"><i className="fas fa-chevron-down" /></a>
      </div>
    </section>
  );
}
