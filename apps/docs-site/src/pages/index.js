import React, { useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

/* -------------------------------------------------------
   Intersection Observer hook for scroll-triggered reveals
   ------------------------------------------------------- */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, style = {} }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal-block"
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------
   HERO — Full-bleed cinematic opening
   ------------------------------------------------------- */
function Hero() {
  return (
    <section style={styles.hero} className="tkb-grain">
      <div style={styles.heroInner}>
        <Reveal>
          <span style={styles.heroLabel} className="tkb-label">
            Open Consulting Company
          </span>
        </Reveal>
        <Reveal delay={120}>
          <h1 style={styles.heroTitle} className="tkb-serif">
            Frameworks for organizations{' '}
            <em style={styles.heroTitleEm}>that center people</em>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <hr style={styles.heroRule} />
        </Reveal>
        <Reveal delay={360}>
          <p style={styles.heroSub}>
            Liberation-centered strategy, tools, and methodology —
            built in public, licensed to share, designed for
            mission-driven leaders building what lasts.
          </p>
        </Reveal>
        <Reveal delay={480}>
          <div style={styles.heroCta}>
            <Link className="button button--primary button--lg" to="/docs/frameworks/compassionate-agility">
              Explore Frameworks
            </Link>
            <Link
              className="button button--lg"
              to="/blog"
              style={styles.heroCtaSecondary}
            >
              Read the Journal
            </Link>
          </div>
        </Reveal>
      </div>
      {/* Diagonal slice at bottom */}
      <svg style={styles.heroSlice} viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,80 L1440,0 L1440,80 Z" fill="var(--tkb-warm-bg, #faf8f5)" />
      </svg>
    </section>
  );
}

/* -------------------------------------------------------
   IMPACT STRIP — Stat callouts (impact report style)
   ------------------------------------------------------- */
const stats = [
  { value: '20+', label: 'Years in nonprofit leadership' },
  { value: '3', label: 'Open frameworks published' },
  { value: '100%', label: 'Methodology open-source' },
];

function ImpactStrip() {
  return (
    <section style={styles.impactSection}>
      <div style={styles.impactGrid}>
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 150}>
            <div style={styles.impactCard}>
              <span style={styles.impactValue} className="tkb-serif">{s.value}</span>
              <span style={styles.impactLabel}>{s.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------
   FRAMEWORKS — Editorial cards
   ------------------------------------------------------- */
const frameworks = [
  {
    title: 'Compassionate Agility',
    description:
      'Navigate organizational change through empathy, clarity, and adaptive leadership — without sacrificing the people doing the work.',
    href: '/docs/frameworks/compassionate-agility',
    num: '01',
  },
  {
    title: 'Liberation Mapping',
    description:
      'Strategic planning that centers dignity, collective care, and systemic transformation over deficit-based approaches.',
    href: '/docs/frameworks/liberation-mapping',
    num: '02',
  },
  {
    title: "The Steward's Manual",
    description:
      'A guide for mission-driven leaders on sustainable organizational stewardship — building what lasts and feels good to sustain.',
    href: '/docs/frameworks/stewards-manual',
    num: '03',
  },
];

function Frameworks() {
  return (
    <section style={styles.frameworksSection}>
      <div style={styles.sectionInner}>
        <Reveal>
          <span style={styles.sectionLabel} className="tkb-label">
            Core Methodology
          </span>
        </Reveal>
        <Reveal delay={100}>
          <h2 style={styles.sectionTitle} className="tkb-serif">
            Open-source frameworks for<br />mission-driven organizations
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <hr className="tkb-gold-rule" style={{ margin: '2rem 0 3.5rem' }} />
        </Reveal>
        <div style={styles.frameworkGrid}>
          {frameworks.map((fw, i) => (
            <Reveal key={i} delay={300 + i * 150}>
              <Link to={fw.href} style={styles.frameworkCard}>
                <span style={styles.frameworkNum}>{fw.num}</span>
                <h3 style={styles.frameworkTitle} className="tkb-serif">
                  {fw.title}
                </h3>
                <p style={styles.frameworkDesc}>{fw.description}</p>
                <span style={styles.frameworkArrow}>→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------
   PHILOSOPHY — Cinematic text block
   ------------------------------------------------------- */
function Philosophy() {
  return (
    <section style={styles.philosophySection} className="tkb-grain">
      <div style={styles.philosophyInner}>
        <Reveal>
          <span style={{ ...styles.sectionLabel, color: 'rgba(255,208,136,0.7)' }} className="tkb-label">
            Why Open
          </span>
        </Reveal>
        <Reveal delay={150}>
          <blockquote style={styles.philosophyQuote} className="tkb-serif">
            "The frameworks and tools that strengthen organizations should be accessible —
            not locked behind proposals."
          </blockquote>
        </Reveal>
        <Reveal delay={300}>
          <p style={styles.philosophyBody}>
            TKB Strategies publishes its consulting methodology as open-source.
            Client-specific work stays private. The approach doesn't have to.
            Every framework, template, and tool on this site is version-controlled
            on GitHub and free to use.
          </p>
        </Reveal>
        <Reveal delay={400}>
          <div style={styles.philosophyCta}>
            <Link
              className="button button--lg"
              to="https://github.com/TKB-Strategies/OpenStrategies"
              style={styles.philosophyBtn}
            >
              View on GitHub
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------
   TOOLS — Quick preview
   ------------------------------------------------------- */
function Tools() {
  return (
    <section style={styles.toolsSection}>
      <div style={styles.sectionInner}>
        <div style={styles.toolsLayout}>
          <div style={styles.toolsText}>
            <Reveal>
              <span style={styles.sectionLabel} className="tkb-label">
                Tools & Assessments
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h2 style={styles.toolsTitle} className="tkb-serif">
                Patterns & Protection
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <hr className="tkb-gold-rule" style={{ margin: '1.5rem 0' }} />
            </Reveal>
            <Reveal delay={300}>
              <p style={styles.toolsDesc}>
                A trauma-informed self-reflection tool that helps mission-driven
                professionals understand how their nervous system patterns shape
                leadership decisions and workplace responses. Free, anonymous,
                no account required.
              </p>
            </Reveal>
            <Reveal delay={400}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  className="button button--primary"
                  to="https://tkbstrategies.com/patterns-and-protection"
                >
                  Take the Assessment
                </Link>
                <Link
                  className="button button--secondary"
                  to="/docs/tools/quiz"
                >
                  Read Documentation
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <div style={styles.toolsVisual}>
              <div style={styles.toolsCard}>
                <div style={styles.toolsCardLabel}>Self-Reflection Tool</div>
                <div style={styles.toolsCardTitle} className="tkb-serif">
                  Understand your workplace response patterns
                </div>
                <div style={styles.toolsCardMeta}>
                  <span>15 questions</span>
                  <span>·</span>
                  <span>Instant results</span>
                  <span>·</span>
                  <span>Trauma-informed</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------
   FINAL CTA — Warm close
   ------------------------------------------------------- */
function ClosingCta() {
  return (
    <section style={styles.closingSection}>
      <div style={styles.closingInner}>
        <Reveal>
          <span style={styles.sectionLabel} className="tkb-label">
            Connect
          </span>
        </Reveal>
        <Reveal delay={100}>
          <h2 style={styles.closingTitle} className="tkb-serif">
            Strategy should feel both<br />ambitious and doable
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <hr className="tkb-gold-rule tkb-gold-rule--center" style={{ margin: '2rem auto' }} />
        </Reveal>
        <Reveal delay={300}>
          <p style={styles.closingDesc}>
            Whether you're exploring frameworks for your organization, interested
            in the open consulting model, or want to work together directly —
            the door is open.
          </p>
        </Reveal>
        <Reveal delay={400}>
          <div style={styles.closingCtas}>
            <Link className="button button--primary button--lg" to="https://tkbstrategies.com/work-with-me/">
              Work with TKB Strategies
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/frameworks/compassionate-agility">
              Start with Compassionate Agility
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------
   PAGE
   ------------------------------------------------------- */
export default function Home() {
  return (
    <Layout
      title="Open Frameworks for Mission-Driven Organizations"
      description="Liberation-centered consulting frameworks, tools, and methodology — built in public by TKB Strategies."
    >
      <style>{revealCSS}</style>
      <main>
        <Hero />
        <ImpactStrip />
        <Frameworks />
        <Philosophy />
        <Tools />
        <ClosingCta />
      </main>
    </Layout>
  );
}

/* -------------------------------------------------------
   REVEAL CSS (injected inline to avoid module issues)
   ------------------------------------------------------- */
const revealCSS = `
  .reveal-block {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.8s cubic-bezier(0.25, 0.1, 0.25, 1),
                transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  .reveal-block.revealed {
    opacity: 1;
    transform: translateY(0);
  }
  /* Responsiveness */
  @media (max-width: 768px) {
    .framework-grid-resp { flex-direction: column !important; }
    .tools-layout-resp { flex-direction: column !important; }
    .hero-title-resp { font-size: 2.2rem !important; }
    .philosophy-quote-resp { font-size: 1.5rem !important; }
  }
`;

/* -------------------------------------------------------
   STYLES — Inline style objects
   ------------------------------------------------------- */
const styles = {
  /* HERO */
  hero: {
    position: 'relative',
    background: 'linear-gradient(160deg, #1a2530 0%, #2a3e50 40%, #345168 100%)',
    color: '#ffffff',
    padding: '10rem 2rem 8rem',
    overflow: 'hidden',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
  },
  heroInner: {
    maxWidth: '760px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  },
  heroLabel: {
    display: 'inline-block',
    marginBottom: '1.5rem',
    color: 'rgba(255, 208, 136, 0.8)',
    fontSize: '0.7rem',
    fontWeight: 900,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
    fontWeight: 400,
    lineHeight: 1.15,
    color: '#ffffff',
    margin: 0,
  },
  heroTitleEm: {
    fontStyle: 'italic',
    color: '#ffd088',
  },
  heroRule: {
    width: '80px',
    height: '2px',
    background: '#ffb356',
    border: 'none',
    margin: '2rem 0',
  },
  heroSub: {
    fontSize: '1.15rem',
    lineHeight: 1.75,
    color: 'rgba(255, 255, 255, 0.72)',
    maxWidth: '540px',
    margin: '0 0 2.5rem',
    fontWeight: 300,
  },
  heroCta: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  heroCtaSecondary: {
    background: 'transparent',
    color: '#ffffff',
    border: '1.5px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '100px',
    fontWeight: 700,
    fontSize: '0.875rem',
    letterSpacing: '0.04em',
    padding: '0.8rem 2.25rem',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
  heroSlice: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    width: '100%',
    height: '80px',
    zIndex: 3,
  },

  /* IMPACT STRIP */
  impactSection: {
    background: 'var(--tkb-warm-bg)',
    padding: '5rem 2rem',
  },
  impactGrid: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    gap: '4rem',
    flexWrap: 'wrap',
  },
  impactCard: {
    textAlign: 'center',
    minWidth: '180px',
  },
  impactValue: {
    display: 'block',
    fontSize: '3.5rem',
    lineHeight: 1,
    color: 'var(--tkb-slate)',
    marginBottom: '0.5rem',
  },
  impactLabel: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: 'var(--tkb-text-secondary)',
    textTransform: 'uppercase',
  },

  /* FRAMEWORKS */
  frameworksSection: {
    padding: '6rem 2rem',
    background: 'var(--ifm-background-color, #ffffff)',
  },
  sectionInner: {
    maxWidth: '1060px',
    margin: '0 auto',
  },
  sectionLabel: {
    display: 'inline-block',
    marginBottom: '0.75rem',
    fontSize: '0.7rem',
    fontWeight: 900,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--tkb-dark-gold)',
  },
  sectionTitle: {
    fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
    lineHeight: 1.2,
    color: 'var(--ifm-heading-color)',
    margin: 0,
  },
  frameworkGrid: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  frameworkCard: {
    flex: '1 1 280px',
    display: 'flex',
    flexDirection: 'column',
    padding: '2.5rem 2rem',
    background: 'var(--tkb-warm-bg)',
    borderRadius: '2px',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)',
    borderLeft: '3px solid transparent',
    position: 'relative',
  },
  frameworkNum: {
    fontFamily: "'Lato', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 900,
    letterSpacing: '0.1em',
    color: 'var(--tkb-amber)',
    marginBottom: '1rem',
    display: 'block',
  },
  frameworkTitle: {
    fontSize: '1.4rem',
    lineHeight: 1.25,
    color: 'var(--ifm-heading-color)',
    margin: '0 0 1rem',
  },
  frameworkDesc: {
    fontSize: '0.95rem',
    lineHeight: 1.7,
    color: 'var(--tkb-text-secondary)',
    flex: 1,
    margin: 0,
  },
  frameworkArrow: {
    display: 'inline-block',
    marginTop: '1.5rem',
    fontSize: '1.25rem',
    color: 'var(--tkb-amber)',
    transition: 'transform 0.3s ease',
  },

  /* PHILOSOPHY */
  philosophySection: {
    position: 'relative',
    background: 'linear-gradient(160deg, #1a2530 0%, #243342 100%)',
    padding: '8rem 2rem',
    textAlign: 'center',
    overflow: 'hidden',
  },
  philosophyInner: {
    maxWidth: '700px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  },
  philosophyQuote: {
    fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
    lineHeight: 1.35,
    color: '#ffffff',
    fontStyle: 'italic',
    margin: '0 0 2rem',
    border: 'none',
    background: 'none',
    padding: 0,
  },
  philosophyBody: {
    fontSize: '1.05rem',
    lineHeight: 1.8,
    color: 'rgba(255, 255, 255, 0.6)',
    maxWidth: '560px',
    margin: '0 auto 2.5rem',
  },
  philosophyCta: {
    display: 'flex',
    justifyContent: 'center',
  },
  philosophyBtn: {
    background: 'transparent',
    color: '#ffd088',
    border: '1.5px solid rgba(255, 208, 136, 0.4)',
    borderRadius: '100px',
    fontWeight: 700,
    fontSize: '0.875rem',
    letterSpacing: '0.04em',
    padding: '0.8rem 2.25rem',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },

  /* TOOLS */
  toolsSection: {
    padding: '6rem 2rem',
    background: 'var(--tkb-warm-bg)',
  },
  toolsLayout: {
    display: 'flex',
    gap: '4rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  toolsText: {
    flex: '1 1 360px',
  },
  toolsTitle: {
    fontSize: '2rem',
    color: 'var(--ifm-heading-color)',
    margin: 0,
  },
  toolsDesc: {
    fontSize: '1.05rem',
    lineHeight: 1.8,
    color: 'var(--tkb-text-secondary)',
    marginBottom: '2rem',
    maxWidth: '480px',
  },
  toolsVisual: {
    flex: '1 1 300px',
    display: 'flex',
    justifyContent: 'center',
  },
  toolsCard: {
    background: 'linear-gradient(160deg, #345168 0%, #1a2530 100%)',
    borderRadius: '2px',
    padding: '3rem 2.5rem',
    color: '#ffffff',
    maxWidth: '360px',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  toolsCardLabel: {
    fontSize: '0.65rem',
    fontWeight: 900,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(255, 208, 136, 0.7)',
    marginBottom: '1.25rem',
  },
  toolsCardTitle: {
    fontSize: '1.35rem',
    lineHeight: 1.3,
    marginBottom: '1.5rem',
  },
  toolsCardMeta: {
    display: 'flex',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
    flexWrap: 'wrap',
  },

  /* CLOSING CTA */
  closingSection: {
    padding: '7rem 2rem',
    textAlign: 'center',
    background: 'var(--ifm-background-color, #ffffff)',
  },
  closingInner: {
    maxWidth: '640px',
    margin: '0 auto',
  },
  closingTitle: {
    fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
    lineHeight: 1.2,
    color: 'var(--ifm-heading-color)',
    margin: 0,
  },
  closingDesc: {
    fontSize: '1.1rem',
    lineHeight: 1.75,
    color: 'var(--tkb-text-secondary)',
    marginBottom: '2.5rem',
  },
  closingCtas: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
};
