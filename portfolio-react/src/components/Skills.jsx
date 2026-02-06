const SKILLS = [
  {
    title: 'Frontend',
    icon: 'fas fa-laptop-code',
    items: [
      { icon: 'fab fa-html5', name: 'HTML5' },
      { icon: 'fab fa-css3-alt', name: 'CSS3' },
      { icon: 'fab fa-js', name: 'JavaScript' },
      { icon: 'fab fa-react', name: 'React' },
      { icon: 'fab fa-vuejs', name: 'Vue.js' },
    ],
  },
  {
    title: 'Backend',
    icon: 'fas fa-server',
    items: [
      { icon: 'fab fa-node-js', name: 'Node.js' },
      { icon: 'fab fa-python', name: 'Python' },
      { icon: 'fas fa-database', name: 'MongoDB' },
      { icon: 'fas fa-database', name: 'PostgreSQL' },
      { icon: 'fas fa-fire', name: 'Firebase' },
    ],
  },
  {
    title: 'Tools & Others',
    icon: 'fas fa-tools',
    items: [
      { icon: 'fab fa-git-alt', name: 'Git' },
      { icon: 'fab fa-figma', name: 'Figma' },
      { icon: 'fab fa-docker', name: 'Docker' },
      { icon: 'fas fa-cloud', name: 'AWS' },
      { icon: 'fas fa-mobile-alt', name: 'Responsive Design' },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2 className="section-title">My Skills</h2>
        <p className="section-subtitle">Technologies and tools I work with</p>
        <div className="skills-grid">
          {SKILLS.map((cat) => (
            <div key={cat.title} className="skill-category">
              <h3><i className={cat.icon} /> {cat.title}</h3>
              <div className="skill-items">
                {cat.items.map((item) => (
                  <div key={item.name} className="skill-item">
                    <i className={item.icon} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
