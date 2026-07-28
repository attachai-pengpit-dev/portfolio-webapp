import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import {
  Mail,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  MapPin,
  Phone,
  Code2,
  Database,
  Wrench,
  Workflow,
  Terminal,
  GraduationCap,
  Sparkles,
  Briefcase,
  FolderOpen,
  Send,
  Languages as LanguagesIcon,
  Heart,
  Globe,
  Footprints,
  Gamepad2,
  ChefHat,
  HeartPulse,
  Brain,
  CalendarDays,
  Award,
  Star,
  Layers,
  Building2,
  Blocks,
  Webhook,
  Gauge,
  Repeat,
  Bot,
  User,
  ArrowUp,
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import {
  SiDotnet,
  SiReact,
  SiTypescript,
  SiGo,
  SiDart,
  SiJavascript,
  SiPython,
  SiHtml5,
  SiCss,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiGithub,
  SiDocker,
  SiJira,
} from 'react-icons/si';
/* Microsoft pulled its marks from Simple Icons, so these come from Tabler/Devicon */
import { TbBrandCSharp, TbBrandVisualStudio, TbBrandVscode } from 'react-icons/tb';
import { DiMsqlServer } from 'react-icons/di';
import portfolioData from './data/portfolio.json';
import './App.css';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

/* Apple's UI easing, expressed as a GSAP curve */
const EASE = 'power3.out';

const STATS = [
  { value: 7, suffix: '+', label: 'Years Experience' },
  { value: 4, suffix: '', label: 'Professional Roles' },
];

/* Rotating role words typed out under the hero title */
const ROTATING_WORDS = [
  'Senior Full Stack Developer',
  'C# / .NET Engineer',
  'React & TypeScript Developer',
  'System Architecture Designer',
];

/* "Attachai Pengpit (Fluke)" -> "AP" — skips nicknames in parentheses */
const initials = (name) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

/* Drops the "(Fluke)" so the hero headline stays a clean wordmark */
const displayName = (name) => name.replace(/\s*\(.*?\)\s*/g, '').trim();

const CATEGORY_ICONS = {
  'Languages & Frameworks': Code2,
  Databases: Database,
  'Tools & Technologies': Wrench,
  'Development Practices': Workflow,
};

/* Shuttlecock: lucide has no badminton glyph, so this is drawn to match its
   conventions — 24px box, 1.8 stroke, round caps, currentColor. */
function Shuttlecock({ size = 14, strokeWidth = 1.8, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {/* feather skirt, flaring upward from the cork */}
      <path d="M9.4 14.7 6.6 6.1c1.8-.9 9-.9 10.8 0l-2.8 8.6" />
      {/* open rim across the top of the skirt */}
      <path d="M6.6 6.1c1.8 1.1 9 1.1 10.8 0" />
      {/* centre seam — a horizontal band here reads as a waste bin at 14px */}
      <path d="M12 14.4V6.6" />
      {/* cork, slightly wider than the skirt base as on a real shuttle */}
      <circle cx="12" cy="17.5" r="2.9" />
    </svg>
  );
}

/* Icon per interest; anything unlisted falls back to a neutral mark */
const INTEREST_ICONS = {
  Badminton: Shuttlecock,
  'Trail Running': Footprints,
  Gaming: Gamepad2,
  Cooking: ChefHat,
  Wellness: HeartPulse,
  Psychology: Brain,
};

/* Flags beat a repeated globe here, and lucide ships no flag glyphs */
const LANGUAGE_FLAGS = {
  Thai: '🇹🇭',
  English: '🇬🇧',
};

/* Brand mark per skill; the practices have no logo, so they take a lucide icon.
   Keys match src/data/portfolio.json exactly — unmapped skills render bare. */
const SKILL_ICONS = {
  'C#': TbBrandCSharp,
  '.NET': SiDotnet,
  React: SiReact,
  TypeScript: SiTypescript,
  Go: SiGo,
  Dart: SiDart,
  JavaScript: SiJavascript,
  Python: SiPython,
  HTML: SiHtml5,
  CSS: SiCss,
  'SQL Server': DiMsqlServer,
  MySQL: SiMysql,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  'Visual Studio': TbBrandVisualStudio,
  'VS Code': TbBrandVscode,
  'Git & GitHub': SiGithub,
  Docker: SiDocker,
  Jira: SiJira,
  'Software Architecture Design': Blocks,
  'API Integration': Webhook,
  'System Performance Tuning': Gauge,
  'Agile/Scrum': Repeat,
  'Multi-Agent AI Workflows': Bot,
};

/* Nav labels are matched by id, not text, so relabelling can't break this */
const NAV_ICONS = {
  about: User,
  work: Briefcase,
  education: GraduationCap,
  projects: FolderOpen,
};

/* Small icon in front of a section label */
function Kicker({ icon: Icon, children, className = '' }) {
  return (
    <span className={`kicker ${className}`}>
      <Icon size={14} strokeWidth={2} />
      {children}
    </span>
  );
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function App() {
  const { personalInfo, techStack, experience, education, languages, interests, projects } =
    portfolioData;
  const hasProjects = projects.length > 0;
  const name = displayName(personalInfo.name);
  const allSkills = techStack.flatMap((s) => s.skills);
  /* Third figure counts the stack itself, so it can never drift from the data */
  const stats = [...STATS, { value: allSkills.length, suffix: '', label: 'Technologies' }];

  /* Projects section is dropped entirely until real ones exist */
  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'work', label: 'Experience' },
    { id: 'education', label: 'Education' },
    ...(hasProjects ? [{ id: 'projects', label: 'Projects' }] : []),
  ];

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showTop, setShowTop] = useState(false);
  const root = useRef(null);
  const smoother = useRef(null);
  const marquee = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setShowTop(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      /* Progress bar and the active-nav spy are navigation aids, not decoration,
         so they run even when the visitor asked for reduced motion. */
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => gsap.set('.scroll-progress', { scaleX: self.progress }),
      });

      /* '' for the hero, so scrolling back to the top clears the highlight */
      [{ id: 'top', mark: '' }, ...navItems.map((i) => ({ id: i.id, mark: i.id }))].forEach(
        ({ id, mark }) => {
          const section = document.getElementById(id);
          if (!section) return;
          ScrollTrigger.create({
            trigger: section,
            start: 'top 45%',
            end: 'bottom 45%',
            onToggle: (self) => self.isActive && setActiveSection(mark),
          });
        }
      );

      if (reduced) {
        // Nothing animates — just make every staged element visible.
        gsap.set('.reveal', { opacity: 1, y: 0, clearProps: 'all' });
        root.current.querySelector('.typed').textContent = ROTATING_WORDS[0];
        return;
      }

      /* ---- Inertial page scroll (desktop pointers only) ---- */
      if (window.matchMedia('(pointer: fine)').matches) {
        ScrollSmoother.get()?.kill(); // StrictMode remounts must not stack instances
        smoother.current = ScrollSmoother.create({
          wrapper: '#smooth-wrapper',
          content: '#smooth-content',
          smooth: 1.1,
          effects: true,
          normalizeScroll: false,
        });
      }

      /* ---- Ambient orbs drift forever behind everything ---- */
      gsap.to('.orb-1', {
        x: 90,
        y: 70,
        scale: 1.12,
        duration: 22,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
      gsap.to('.orb-2', {
        x: -80,
        y: 90,
        scale: 1.08,
        duration: 26,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
      gsap.to('.orb-3', {
        x: 70,
        y: -80,
        scale: 1.15,
        duration: 30,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      /* ---- Hero: characters rise into place, then the rest cascades ----
         fromTo throughout: from() tweens can be left half-applied when React
         mounts twice in StrictMode, fromTo always restates both endpoints. */
      const heroSplit = new SplitText('.hero-title', {
        type: 'chars',
        mask: 'chars', // per-char clipping wrapper, so glyphs slide out of a hidden edge
        charsClass: 'split-char',
      });

      /* Splitting breaks background-clip: text — the parent's gradient can't
         reach the new char spans. Re-paint it per char, offsetting each one's
         background so the whole name still reads as one continuous gradient.
         Only the chars inside .hero-name get it; "Hi, I'm" stays plain. */
      const nameEl = root.current.querySelector('.hero-name');
      const nameChars = heroSplit.chars.filter((char) => nameEl.contains(char));
      const paintGradient = () => {
        const box = nameEl.getBoundingClientRect();
        nameChars.forEach((char) => {
          const rect = char.getBoundingClientRect();
          char.style.backgroundSize = `${box.width}px ${box.height}px`;
          char.style.backgroundPosition = `${box.left - rect.left}px ${box.top - rect.top}px`;
        });
      };
      paintGradient();
      window.addEventListener('resize', paintGradient);

      const intro = gsap.timeline({ defaults: { ease: EASE } });

      intro
        .fromTo('.hero-badge', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.1)
        .fromTo(
          heroSplit.chars,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.028 },
          0.2
        )
        .fromTo('.hero-sub', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.55)
        .fromTo(
          '.hero-tagline',
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          0.66
        )
        .fromTo(
          '.hero-actions > *',
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 },
          0.76
        )
        .fromTo(
          '.hero-stats .stat',
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.09 },
          0.9
        )
        .fromTo(
          '.code-window',
          { y: 34, opacity: 0, rotateY: -14 },
          { y: 0, opacity: 1, rotateY: -7, duration: 1.3 },
          0.45
        )
        .fromTo('.scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.9 }, 1.2);

      /* The code window breathes on a slow loop */
      gsap.to('.code-window', {
        y: -14,
        duration: 3.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.8,
      });

      /* Counters tick up as part of the same intro */
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const counter = { v: 0 };
        intro.to(
          counter,
          {
            v: target,
            duration: 1.6,
            ease: 'power2.out',
            snap: { v: 1 },
            onUpdate: () => {
              el.textContent = `${Math.round(counter.v)}${suffix}`;
            },
          },
          0.95
        );
      });

      /* ---- Rotating role, typed then backspaced on a loop ----
         Driving a character count rather than TextPlugin: TextPlugin shrinks a
         string by eating it from the left, which reads as a glitch, not typing. */
      const typedEl = root.current.querySelector('.typed');
      const cursor = { chars: 0 };
      const paintTyped = (word) => () => {
        typedEl.textContent = word.slice(0, Math.round(cursor.chars));
      };
      const typeLoop = gsap.timeline({ repeat: -1, delay: 1.2 });
      ROTATING_WORDS.forEach((word) => {
        typeLoop
          .fromTo(
            cursor,
            { chars: 0 },
            {
              chars: word.length,
              duration: word.length * 0.05,
              ease: 'none',
              onUpdate: paintTyped(word),
            }
          )
          .to({}, { duration: 1.5 })
          .to(cursor, {
            chars: 0,
            duration: word.length * 0.022,
            ease: 'none',
            onUpdate: paintTyped(word),
          });
      });

      /* ---- Hero recedes as the page scrolls past it ---- */
      gsap.to('.hero-grid, .hero-stats', {
        y: -60,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      });

      /* ---- Skills ticker ---- */
      marquee.current = gsap.to('.marquee-track', {
        xPercent: -50,
        duration: 38,
        ease: 'none',
        repeat: -1,
      });

      /* ---- Section headlines split into lines and lift in ---- */
      gsap.utils.toArray('[data-split]').forEach((el) => {
        const split = new SplitText(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
        });
        gsap.fromTo(
          split.lines,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: EASE,
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: 'top 88%' },
          }
        );
      });

      /* ---- Everything else: batched so rows animate together ---- */
      ScrollTrigger.batch('.reveal', {
        start: 'top 88%',
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: EASE,
            stagger: 0.11,
            overwrite: 'auto', // only clobbers conflicting props, so card scale survives
          }),
      });

      /* ---- Cards get a touch of depth on the way in ---- */
      gsap.utils.toArray('.card').forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.97 },
          {
            scale: 1,
            duration: 1.1,
            ease: EASE,
            scrollTrigger: { trigger: card, start: 'top 90%' },
          }
        );
      });

      /* ---- Timeline rail fills as you read down the work history ---- */
      gsap.fromTo(
        '.work-rail-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.work-list',
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: 0.6,
          },
        }
      );

      ScrollTrigger.refresh();

      return () => window.removeEventListener('resize', paintGradient);
    },
    { scope: root }
  );

  /* Anchor navigation has to go through the smoother when it's running */
  const goTo = (e, id) => {
    setMenuOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    if (smoother.current) {
      smoother.current.scrollTo(target, true, 'top 52px');
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /* Ticker eases to a stop under the cursor, then back up to speed — tweening
     timeScale instead of pause()/resume() avoids a jolt mid-scroll. */
  const setMarqueeSpeed = (scale) => {
    if (!marquee.current) return;
    gsap.to(marquee.current, { timeScale: scale, duration: 0.45, ease: 'power2.out' });
  };

  /* Feeds the cursor-following spotlight on glass cards */
  const handleCardMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div ref={root}>
      {/* Ambient light, fixed behind everything */}
      <div className="backdrop" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-lines" />
      </div>

      {/* Fills as the page scrolls; sits above the nav */}
      <div className="scroll-progress" aria-hidden="true" />

      {/* Nav lives outside the smoothed content so `position: fixed` still works */}
      <nav className={`nav ${scrolled ? 'nav-scrolled' : ''} ${menuOpen ? 'nav-open' : ''}`}>
        <div className="container container-wide nav-content">
          <a href="#top" className="logo" onClick={(e) => goTo(e, 'top')}>
            <span className="logo-mark">{initials(personalInfo.name)}</span>
            <span className="logo-text">{name}</span>
          </a>

          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {navItems.map((item) => {
              const Icon = NAV_ICONS[item.id];
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={activeSection === item.id ? 'active' : ''}
                  onClick={(e) => goTo(e, item.id)}
                >
                  {Icon && <Icon size={14} strokeWidth={1.9} />}
                  {item.label}
                </a>
              );
            })}
            <a
              href="#contact"
              className="btn btn-primary btn-sm nav-cta"
              onClick={(e) => goTo(e, 'contact')}
            >
              <Mail size={14} strokeWidth={2} /> Contact
            </a>
          </div>

          <button
            className="nav-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <a
        href="#top"
        className={`to-top ${showTop ? 'show' : ''}`}
        aria-label="Back to top"
        onClick={(e) => goTo(e, 'top')}
      >
        <ArrowUp size={18} strokeWidth={2.2} />
      </a>

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="app">
            {/* Hero */}
            <header id="top" className="hero">
              <div className="hero-glow" data-speed="0.75" aria-hidden="true" />

              <div className="container hero-grid">
                <div className="hero-inner">
                  <span className="hero-badge">
                    <span className="badge-dot" />
                    Available for new opportunities
                  </span>
                  <h1 className="display hero-title">
                    Hi, I'm
                    <br />
                    <span className="text-gradient hero-name">{personalInfo.name}</span>
                  </h1>
                  <h2 className="subhead hero-sub">
                    <span className="typed" />
                    <span className="caret" aria-hidden="true" />
                  </h2>
                  <p className="hero-tagline">{personalInfo.tagline}</p>
                  <div className="hero-actions">
                    <a
                      href="#work"
                      className="btn btn-primary btn-lg"
                      onClick={(e) => goTo(e, 'work')}
                    >
                      View Work <ChevronRight size={18} strokeWidth={2.4} />
                    </a>
                    <a
                      href={personalInfo.github}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-lg"
                    >
                      <FaGithub size={18} /> GitHub
                    </a>
                  </div>
                </div>

                <div className="hero-graphic" data-speed="1.08">
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
              </div>

              <div className="container hero-stats">
                {stats.map((stat) => (
                  <div key={stat.label} className="stat">
                    <strong
                      className="text-gradient"
                      data-count={stat.value}
                      data-suffix={stat.suffix}
                    >
                      0{stat.suffix}
                    </strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>

              <a href="#about" className="scroll-hint" onClick={(e) => goTo(e, 'about')}>
                <span className="mouse">
                  <span className="wheel" />
                </span>
                Scroll
              </a>
            </header>

            {/* Skills ticker */}
            <div
              className="marquee"
              aria-hidden="true"
              onMouseEnter={() => setMarqueeSpeed(0)}
              onMouseLeave={() => setMarqueeSpeed(1)}
            >
              <div className="marquee-track">
                {[...allSkills, ...allSkills].map((skill, idx) => {
                  const Logo = SKILL_ICONS[skill];
                  return (
                    <span key={idx} className="marquee-item">
                      {Logo && <Logo className="skill-logo" />}
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* About */}
            <section id="about" className="section">
              <div className="container">
                <div className="about-grid">
                  <div>
                    <Kicker icon={Sparkles} className="reveal">
                      About
                    </Kicker>
                    <h2 className="headline" data-split>
                      Software that holds up
                      <br />
                      under real load.
                    </h2>
                  </div>
                  <div className="about-body">
                    <p className="lede reveal">{personalInfo.about}</p>
                    <p className="about-place reveal">
                      <MapPin size={16} strokeWidth={1.8} /> {personalInfo.location}
                    </p>

                    <div className="about-extra">
                      <div className="extra-block reveal">
                        <Kicker icon={LanguagesIcon}>Languages</Kicker>
                        <ul className="spec-list">
                          {languages.map((lang) => (
                            <li key={lang.name}>
                              <span>
                                {LANGUAGE_FLAGS[lang.name] ? (
                                  <span className="flag" role="img" aria-label={lang.name}>
                                    {LANGUAGE_FLAGS[lang.name]}
                                  </span>
                                ) : (
                                  <Globe size={15} strokeWidth={1.8} />
                                )}
                                {lang.name}
                              </span>
                              <em>{lang.level}</em>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="extra-block reveal">
                        <Kicker icon={Heart}>Off the clock</Kicker>
                        <div className="chip-row">
                          {interests.map((item) => {
                            const Icon = INTEREST_ICONS[item] || Sparkles;
                            return (
                              <span key={item} className="chip">
                                <Icon size={14} strokeWidth={1.8} />
                                {item}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Tech stack */}
            <section className="section band-alt">
              <div className="container">
                <div className="section-head">
                  <Kicker icon={Layers} className="reveal">
                    Capabilities
                  </Kicker>
                  <h2 className="headline" data-split>
                    The toolkit.
                  </h2>
                </div>
                <div className="spec-grid">
                  {techStack.map((stack) => {
                    const Icon = CATEGORY_ICONS[stack.category] || Terminal;
                    return (
                      <div
                        key={stack.category}
                        className="card spec-card spotlight reveal"
                        onMouseMove={handleCardMove}
                      >
                        <div className="spec-head">
                          <span className="spec-icon">
                            <Icon size={20} strokeWidth={1.8} />
                          </span>
                          <h3 className="spec-title">{stack.category}</h3>
                        </div>
                        <div className="spec-tags">
                          {stack.skills.map((skill) => {
                            const Logo = SKILL_ICONS[skill];
                            return (
                              <span key={skill}>
                                {Logo && <Logo className="skill-logo" aria-hidden="true" />}
                                {skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Experience */}
            <section id="work" className="section">
              <div className="container">
                <div className="section-head">
                  <Kicker icon={Briefcase} className="reveal">
                    Experience
                  </Kicker>
                  <h2 className="headline" data-split>
                    Seven years, four teams.
                  </h2>
                </div>
                <div className="work-list">
                  <div className="work-rail" aria-hidden="true">
                    <div className="work-rail-fill" />
                  </div>
                  {experience.map((exp) => (
                    <article key={exp.id} className="work-item reveal">
                      <div className="work-meta">
                        <span className={`work-dot ${exp.current ? 'current' : ''}`} />
                        <span className="work-duration">
                          <CalendarDays size={14} strokeWidth={1.8} />
                          {exp.duration}
                        </span>
                        {exp.current && <span className="work-now">Now</span>}
                      </div>
                      <div className="work-body">
                        <h3 className="work-role">{exp.role}</h3>
                        <p className="work-company">
                          <Building2 size={15} strokeWidth={1.8} />
                          {exp.company}
                          {exp.location && (
                            <em>
                              <MapPin size={14} strokeWidth={1.8} />
                              {exp.location}
                            </em>
                          )}
                        </p>
                        <ul className="work-points">
                          {exp.highlights.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Education */}
            <section id="education" className="section band-alt">
              <div className="container">
                <div className="section-head">
                  <Kicker icon={GraduationCap} className="reveal">
                    Education
                  </Kicker>
                  <h2 className="headline" data-split>
                    Where it started.
                  </h2>
                </div>
                <div className="edu-list">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="card edu-card spotlight reveal"
                      onMouseMove={handleCardMove}
                    >
                      <span className="edu-icon">
                        <GraduationCap size={24} strokeWidth={1.7} />
                      </span>
                      <div className="edu-body">
                        <h3 className="edu-degree">{edu.degree}</h3>
                        <p className="edu-institution">
                          <Building2 size={15} strokeWidth={1.8} />
                          {edu.institution}
                          {edu.location && (
                            <em>
                              <MapPin size={14} strokeWidth={1.8} />
                              {edu.location}
                            </em>
                          )}
                        </p>
                        <div className="edu-meta">
                          <span className="edu-pill">
                            <CalendarDays size={14} strokeWidth={1.9} />
                            {edu.year}
                          </span>
                          {edu.honors && (
                            <span className="edu-pill edu-honor">
                              <Award size={14} strokeWidth={1.9} />
                              {edu.honors}
                            </span>
                          )}
                          {edu.gpa && (
                            <span className="edu-pill edu-gpa">
                              <Star size={14} strokeWidth={1.9} />
                              GPA {edu.gpa}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Projects — rendered only when real entries exist in portfolio.json */}
            {hasProjects && (
              <section id="projects" className="section">
                <div className="container">
                  <div className="section-head">
                    <Kicker icon={FolderOpen} className="reveal">
                      Selected work
                    </Kicker>
                    <h2 className="headline" data-split>
                      Things I've built.
                    </h2>
                  </div>
                  <div className="project-grid">
                    {projects.map((project, idx) => (
                      <article
                        key={project.id}
                        className="card project-card spotlight reveal"
                        onMouseMove={handleCardMove}
                      >
                        <span className="project-index">{String(idx + 1).padStart(2, '0')}</span>
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-desc">{project.description}</p>
                        <div className="project-tags">
                          {project.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                        <div className="project-links">
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="link-cta"
                          >
                            <FaGithub size={16} /> Source
                          </a>
                          {project.liveUrl !== '#' && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="link-cta"
                            >
                              <ExternalLink size={16} /> Live
                            </a>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Contact */}
            <section id="contact" className="section contact">
              <div className="container contact-inner">
                <Kicker icon={Send} className="reveal">
                  Let's talk
                </Kicker>
                <h2 className="display contact-title" data-split>
                  Have something
                  <br />
                  worth building?
                </h2>
                <p className="subhead contact-sub reveal">
                  Currently open to new opportunities. Say hello and I'll get back to you.
                </p>
                <div className="contact-actions reveal">
                  <a href={`mailto:${personalInfo.email}`} className="btn btn-primary btn-lg">
                    <Mail size={18} strokeWidth={1.9} /> Email me
                  </a>
                  <a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-lg"
                  >
                    <FaLinkedin size={17} /> LinkedIn
                  </a>
                </div>

                <div className="contact-details reveal">
                  <a href={`mailto:${personalInfo.email}`}>
                    <Mail size={15} strokeWidth={1.8} /> {personalInfo.email}
                  </a>
                  <a href={`tel:${personalInfo.phone.replace(/\s/g, '')}`}>
                    <Phone size={15} strokeWidth={1.8} /> {personalInfo.phone}
                  </a>
                  <span>
                    <MapPin size={15} strokeWidth={1.8} /> {personalInfo.location}
                  </span>
                </div>
              </div>
            </section>

            <footer className="footer">
              <div className="container container-wide footer-content">
                <p>
                  Copyright © {new Date().getFullYear()} {name}. All rights reserved.
                </p>
                <div className="footer-links">
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                  >
                    <FaGithub size={16} />
                  </a>
                  <a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={16} />
                  </a>
                  <a href={`mailto:${personalInfo.email}`} aria-label="Email">
                    <Mail size={16} strokeWidth={1.8} />
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
