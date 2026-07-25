import { useEffect, useRef, useState } from 'react';
import {
  Mail,
  ExternalLink,
  Code2,
  Terminal,
  Database,
  ChevronRight,
  Briefcase,
  FolderOpen,
  Sparkles,
  ArrowUp,
  Menu,
  X,
  MapPin,
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import portfolioData from './data/portfolio.json';
import './App.css';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
];

const STATS = [
  { value: 6, suffix: '+', label: 'Years Experience' },
  { value: 30, suffix: '+', label: 'Projects Shipped' },
  { value: 40, suffix: '%', label: 'Performance Gained' },
];

/* Rotating role words shown under the hero title */
const ROTATING_WORDS = ['Full Stack Developer', 'System Architect', 'Problem Solver', 'Team Mentor'];

function useTypewriter(words, { typeSpeed = 90, deleteSpeed = 45, pause = 1600 } = {}) {
  const [text, setText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(words[0]);
      return;
    }
    const current = words[wordIdx];
    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && text === '') {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
      return;
    }
    const t = setTimeout(
      () =>
        setText((prev) =>
          deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)
        ),
      deleting ? deleteSpeed : typeSpeed
    );
    return () => clearTimeout(t);
  }, [text, deleting, wordIdx, words, typeSpeed, deleteSpeed, pause]);

  return text;
}

/* Counts up to `value` once the element scrolls into view */
function CountUp({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 1400;
        let start;
        const step = (ts) => {
          if (start === undefined) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          // ease-out so the number decelerates into place
          setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

function App() {
  const { personalInfo, techStack, experience, projects } = portfolioData;
  const typed = useTypewriter(ROTATING_WORDS);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  /* Scroll progress bar + condensed nav + back-to-top visibility */
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Reveal-on-scroll + active nav link */
  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            reveal.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });

    return () => {
      reveal.disconnect();
      spy.disconnect();
    };
  }, []);

  /* Cursor-following spotlight on glass cards */
  const handleCardMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const getIconForCategory = (category) => {
    switch (category) {
      case 'Frontend':
        return <Code2 size={22} className="category-icon" />;
      case 'Backend':
        return <Terminal size={22} className="category-icon" />;
      case 'Database & Cloud':
        return <Database size={22} className="category-icon" />;
      default:
        return <Code2 size={22} className="category-icon" />;
    }
  };

  const allSkills = techStack.flatMap((s) => s.skills);

  return (
    <div className="app">
      {/* Ambient background */}
      <div className="backdrop" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-lines" />
      </div>

      <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

      {/* Navigation */}
      <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="container nav-content">
          <a href="#top" className="logo">
            <span className="logo-mark">{personalInfo.name.slice(0, 2).toUpperCase()}</span>
            <span className="logo-text">{personalInfo.name}</span>
          </a>

          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={activeSection === item.id ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a href="#contact" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
              Contact Me
            </a>
          </div>

          <button
            className="nav-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header id="top" className="hero container">
        <div className="hero-content">
          <span className="badge animate-fade-in-up">
            <span className="badge-dot" />
            Available for new opportunities
          </span>
          <h1 className="hero-title animate-fade-in-up delay-100">
            Hi, I'm <span className="text-gradient">{personalInfo.name}</span>
          </h1>
          <h2 className="hero-subtitle animate-fade-in-up delay-200">
            <span className="typed">{typed}</span>
            <span className="caret" aria-hidden="true" />
          </h2>
          <p className="hero-description animate-fade-in-up delay-300">{personalInfo.tagline}</p>
          <div className="hero-actions animate-fade-in-up delay-400">
            <a href="#projects" className="btn btn-primary btn-lg">
              View Work <ChevronRight size={20} />
            </a>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-lg"
            >
              <FaGithub size={20} /> GitHub
            </a>
          </div>

          <div className="hero-stats animate-fade-in-up delay-500">
            {STATS.map((stat) => (
              <div key={stat.label} className="stat">
                <strong>
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-graphic animate-fade-in-up delay-300">
          <div className="code-window glass">
            <div className="window-header">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <span className="window-title">developer.js</span>
            </div>
            <pre className="window-body">
              <code>
                <span className="code-keyword">const</span>{' '}
                <span className="code-variable">developer</span> = {'{'}
                <br />
                {'  '}
                <span className="code-property">name</span>:{' '}
                <span className="code-string">'{personalInfo.name}'</span>,
                <br />
                {'  '}
                <span className="code-property">role</span>:{' '}
                <span className="code-string">'{personalInfo.role}'</span>,
                <br />
                {'  '}
                <span className="code-property">coffeeCupsPerDay</span>:{' '}
                <span className="code-number">4</span>,
                <br />
                {'  '}
                <span className="code-property">lovesCoding</span>:{' '}
                <span className="code-keyword">true</span>
                <br />
                {'}'};
              </code>
            </pre>
          </div>
        </div>

        <a href="#about" className="scroll-hint" aria-label="Scroll to about section">
          <span className="mouse">
            <span className="wheel" />
          </span>
          Scroll
        </a>
      </header>

      {/* Skills marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...allSkills, ...allSkills].map((skill, idx) => (
            <span key={idx} className="marquee-item">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* About & Tech Stack */}
      <section id="about" className="container">
        <div className="about-grid">
          <div className="reveal">
            <span className="eyebrow">
              <Sparkles size={14} /> Get to know me
            </span>
            <h3 className="section-title section-title-left">About Me</h3>
            <p className="about-text">{personalInfo.about}</p>
            <p className="about-meta">
              <MapPin size={16} /> Remote friendly · Open to collaboration
            </p>
          </div>
          <div className="tech-stack">
            {techStack.map((stack, idx) => (
              <div
                key={stack.category}
                className="stack-card glass spotlight reveal"
                style={{ transitionDelay: `${idx * 90}ms` }}
                onMouseMove={handleCardMove}
              >
                <div className="stack-header">
                  {getIconForCategory(stack.category)}
                  <h4>{stack.category}</h4>
                </div>
                <div className="skills-tags">
                  {stack.skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="container">
        <div className="section-head reveal">
          <span className="eyebrow">
            <Briefcase size={14} /> Career path
          </span>
          <h3 className="section-title">Work Experience</h3>
        </div>
        <div className="experience-timeline">
          {experience.map((exp, idx) => (
            <div
              key={exp.id}
              className="timeline-item reveal"
              style={{ transitionDelay: `${idx * 120}ms` }}
            >
              <div className="timeline-dot" />
              <div className="timeline-content glass card spotlight" onMouseMove={handleCardMove}>
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
        <div className="section-head reveal">
          <span className="eyebrow">
            <FolderOpen size={14} /> Selected work
          </span>
          <h3 className="section-title">Featured Projects</h3>
        </div>
        <div className="grid-auto-fit">
          {projects.map((project, idx) => (
            <article
              key={project.id}
              className="project-card glass card spotlight reveal"
              style={{ transitionDelay: `${idx * 100}ms` }}
              onMouseMove={handleCardMove}
            >
              <span className="project-index">{String(idx + 1).padStart(2, '0')}</span>
              <div className="project-header">
                <h4>{project.title}</h4>
                <div className="project-links">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    title="Source Code"
                    aria-label={`${project.title} source code`}
                  >
                    <FaGithub size={18} />
                  </a>
                  {project.liveUrl !== '#' && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Live Site"
                      aria-label={`${project.title} live site`}
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
              <p className="project-desc">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="container contact-section reveal">
        <div className="contact-box glass card">
          <span className="eyebrow eyebrow-center">
            <Sparkles size={14} /> Let's talk
          </span>
          <h2>
            Let's build something <span className="text-gradient">amazing</span> together
          </h2>
          <p>
            Currently open for new opportunities. Whether you have a question or just want to say
            hi, I'll try my best to get back to you!
          </p>
          <div className="contact-actions">
            <a href={`mailto:${personalInfo.email}`} className="btn btn-primary btn-lg">
              <Mail size={20} /> Say Hello
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-lg"
            >
              <FaLinkedin size={20} /> LinkedIn
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-content">
          <p>
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>
          <div className="footer-links">
            <a href={personalInfo.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <FaGithub size={18} />
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FaLinkedin size={18} />
            </a>
            <a href={`mailto:${personalInfo.email}`} aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </footer>

      <a
        href="#top"
        className={`to-top ${scrolled ? 'show' : ''}`}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </a>
    </div>
  );
}

export default App;
