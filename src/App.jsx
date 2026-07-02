import { useEffect } from 'react';
import { 
  Mail, 
  ExternalLink, 
  Code2, 
  Terminal, 
  Database, 
  ChevronRight,
  Briefcase,
  FolderOpen
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import portfolioData from './data/portfolio.json';
import './App.css';

function App() {
  const { personalInfo, techStack, experience, projects } = portfolioData;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((elem) => {
      observer.observe(elem);
    });

    return () => observer.disconnect();
  }, []);

  const getIconForCategory = (category) => {
    switch(category) {
      case 'Frontend': return <Code2 size={24} className="category-icon" />;
      case 'Backend': return <Terminal size={24} className="category-icon" />;
      case 'Database & Cloud': return <Database size={24} className="category-icon" />;
      default: return <Code2 size={24} className="category-icon" />;
    }
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="glass nav">
        <div className="container nav-content">
          <div className="logo">{personalInfo.name}</div>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#contact" className="btn btn-primary btn-sm">Contact Me</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero container">
        <div className="hero-content">
          <h1 className="hero-title animate-fade-in-up">
            Hi, I'm <span className="text-gradient">{personalInfo.name}</span>
          </h1>
          <h2 className="hero-subtitle animate-fade-in-up delay-100">
            {personalInfo.role}
          </h2>
          <p className="hero-description animate-fade-in-up delay-200">
            {personalInfo.tagline}
          </p>
          <div className="hero-actions animate-fade-in-up delay-300">
            <a href="#projects" className="btn btn-primary">
              View Work <ChevronRight size={20} />
            </a>
            <a href={personalInfo.github} target="_blank" rel="noreferrer" className="btn btn-secondary">
              <FaGithub size={20} /> GitHub
            </a>
          </div>
        </div>
        <div className="hero-graphic animate-fade-in-up delay-200">
          <div className="code-window glass">
            <div className="window-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <pre className="window-body">
              <code>
<span className="code-keyword">const</span> <span className="code-variable">developer</span> = {'{'}
<br/>  <span className="code-property">name</span>: <span className="code-string">'{personalInfo.name}'</span>,
<br/>  <span className="code-property">role</span>: <span className="code-string">'{personalInfo.role}'</span>,
<br/>  <span className="code-property">coffeeCupsPerDay</span>: <span className="code-number">4</span>,
<br/>  <span className="code-property">lovesCoding</span>: <span className="code-keyword">true</span>
<br/>{'}'};
              </code>
            </pre>
          </div>
        </div>
      </header>

      {/* About & Tech Stack */}
      <section id="about" className="container">
        <div className="about-grid">
          <div className="reveal">
            <h3 className="section-title" style={{ textAlign: 'left' }}>About Me</h3>
            <p className="about-text">{personalInfo.about}</p>
          </div>
          <div className="tech-stack">
            {techStack.map((stack, idx) => (
              <div key={idx} className="stack-card glass reveal" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="stack-header">
                  {getIconForCategory(stack.category)}
                  <h4>{stack.category}</h4>
                </div>
                <div className="skills-tags">
                  {stack.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="container">
        <h3 className="section-title reveal"><Briefcase size={32} /> Work Experience</h3>
        <div className="experience-timeline">
          {experience.map((exp, idx) => (
            <div key={exp.id} className="timeline-item reveal" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="timeline-dot"></div>
              <div className="timeline-content glass card">
                <div className="exp-header">
                  <h4>{exp.role}</h4>
                  <span className="exp-duration">{exp.duration}</span>
                </div>
                <h5 className="exp-company">{exp.company}</h5>
                <p>{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="container">
        <h3 className="section-title reveal"><FolderOpen size={32} /> Featured Projects</h3>
        <div className="grid-auto-fit">
          {projects.map((project, idx) => (
            <div key={project.id} className="project-card glass card reveal" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="project-header">
                <h4>{project.title}</h4>
                <div className="project-links">
                  <a href={project.link} target="_blank" rel="noreferrer" title="Source Code"><FaGithub size={20} /></a>
                  {project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" title="Live Site"><ExternalLink size={20} /></a>
                  )}
                </div>
              </div>
              <p className="project-desc">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="project-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="container contact-section reveal">
        <div className="contact-box glass card">
          <h2>Let's build something amazing together</h2>
          <p>Currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!</p>
          <div className="contact-actions">
            <a href={`mailto:${personalInfo.email}`} className="btn btn-primary btn-lg">
              <Mail size={20} /> Say Hello
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="btn btn-secondary btn-lg">
              <FaLinkedin size={20} /> LinkedIn
            </a>
          </div>
        </div>
      </section>

      <footer className="footer glass">
        <div className="container footer-content">
          <p>© {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>
          <div className="footer-links">
            <a href={personalInfo.github}><FaGithub size={20} /></a>
            <a href={personalInfo.linkedin}><FaLinkedin size={20} /></a>
            <a href={`mailto:${personalInfo.email}`}><Mail size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
