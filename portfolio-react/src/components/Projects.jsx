import { useState, useEffect } from 'react';
import { fetchGitHubRepos } from '../api/github';

const FEATURED = [
  { name: 'E-Commerce Platform', desc: 'Full-stack e-commerce with payment, auth, and admin dashboard.', tags: ['React', 'Node.js', 'MongoDB'], demo: '/projects/ecommerce-platform/index.html' },
  { name: 'Task Management App', desc: 'Collaborative task tool with real-time updates.', tags: ['Vue.js', 'Firebase', 'Vuex'], demo: '/projects/task-management/index.html' },
  { name: 'Weather Dashboard', desc: 'Interactive weather dashboard with forecasts and charts.', tags: ['JavaScript', 'API', 'Chart.js'], demo: '/projects/weather-dashboard/index.html' },
  { name: 'Portfolio CMS', desc: 'CMS for creative professionals and freelancers.', tags: ['React', 'Express', 'PostgreSQL'], demo: '/projects/portfolio-cms/index.html' },
  { name: 'Social Media Dashboard', desc: 'Analytics dashboard for social metrics.', tags: ['Python', 'Flask', 'D3.js'], demo: '/projects/social-dashboard/index.html' },
  { name: 'Fitness Tracker', desc: 'Mobile-first fitness app with workout plans.', tags: ['React Native', 'Redux', 'SQLite'], demo: '/projects/fitness-tracker/index.html' },
  { name: 'Netflix Clone', desc: 'Responsive Netflix clone with browse and playback.', tags: ['React', 'TMDB API', 'CSS3'], demo: '/projects/netflix-clone/index.html' },
];

function getDemoUrl(path) {
  if (path.startsWith('http')) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + path;
}

export default function Projects() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    fetchGitHubRepos(6).then(setRepos);
  }, []);

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-subtitle">Some of my recent work</p>
        <div className="projects-grid">
          {FEATURED.map((proj) => (
            <div key={proj.name} className="project-card">
              <div className="project-image">
                <div className="image-placeholder">
                  <i className={proj.name === 'Netflix Clone' ? 'fas fa-film' : 'fas fa-image'} />
                </div>
                <div className="project-overlay">
                  <a href={getDemoUrl(proj.demo)} className="project-link" target="_blank" rel="noreferrer">
                    <i className="fas fa-external-link-alt" />
                  </a>
                  <a href="https://github.com/maheshs108/Portfolio" className="project-link" target="_blank" rel="noreferrer">
                    <i className="fab fa-github" />
                  </a>
                </div>
              </div>
              <div className="project-content">
                <h3>{proj.name}</h3>
                <p>{proj.desc}</p>
                <div className="project-tags">
                  {proj.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {repos.length > 0 && (
          <>
            <h3 className="section-subtitle" style={{ marginTop: '2rem' }}>Live from GitHub</h3>
            <div className="projects-grid github-repos">
              {repos.slice(0, 4).map((repo) => (
                <a
                  key={repo.id}
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="project-card repo-card"
                >
                  <div className="project-content">
                    <h3>{repo.name}</h3>
                    <p>{repo.description || 'No description'}</p>
                    <div className="project-tags">
                      {repo.language && <span className="tag">{repo.language}</span>}
                      <span className="tag">★ {repo.stargazersCount}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
