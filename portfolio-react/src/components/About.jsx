import { useState, useEffect } from 'react';
import { fetchGitHubProfile } from '../api/github';
import { fetchCurrentWeather } from '../api/weather';

export default function About() {
  const [profile, setProfile] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetchGitHubProfile().then(setProfile);
    fetchCurrentWeather().then(setWeather);
  }, []);

  const avatarUrl = profile?.avatarUrl;

  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-image">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Mahesh Suryawanshi"
                className="about-avatar"
              />
            ) : (
              <div className="image-placeholder">
                <i className="fas fa-user" />
              </div>
            )}
          </div>
          <div className="about-text">
            <h3>Hello! I'm a <span className="highlight">Fresher Developer</span></h3>
            <p>
              I'm a passionate and enthusiastic fresher with a strong foundation in web development.
              I love creating elegant solutions to complex problems and bringing ideas to life through
              clean code and thoughtful user experiences.
            </p>
            <p>
              My journey in development started with a curiosity about how things work. I've been dedicating
              myself to learning modern web technologies and building practical projects to sharpen my skills.
              I'm eager to contribute to real-world projects and grow as a developer.
            </p>
            <div className="about-stats">
              <div className="stat">
                <h4>Fresher</h4>
                <p>Ready to Start</p>
              </div>
              <div className="stat">
                <h4>6+</h4>
                <p>Projects Built</p>
              </div>
              <div className="stat">
                <h4>100%</h4>
                <p>Dedication</p>
              </div>
            </div>
            {weather && (
              <div className="weather-widget">
                <i className="fas fa-cloud-sun" />
                <span>Based in Maharashtra — {weather.temperature}°{weather.unit} {weather.description}</span>
              </div>
            )}
            <a href="your-resume.pdf" className="btn btn-primary" download>Download Resume</a>
          </div>
        </div>
      </div>
    </section>
  );
}
