import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Github, Linkedin, Mail, MapPin, FileText, ArrowUpRight } from 'lucide-react'
import { profile, hero, experience, skills, achievements, footer } from './i18n'

const ROTATING_ROLES = [
  'Lead AI Engineer',
  'LLM Systems Builder',
  'RAG Architect',
  'Multi-Agent Engineer',
  'MLOps Practitioner',
  'EasyOCR Contributor',
] as const

function useTypewriterRotation(
  roles: readonly string[],
  { typeSpeed = 70, deleteSpeed = 35, pauseAfterType = 1800, pauseAfterDelete = 300 } = {},
) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const currentRole = roles[roleIndex]

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (!isDeleting && displayText === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), pauseAfterType)
    } else if (isDeleting && displayText === '') {
      timeout = setTimeout(() => {
        setRoleIndex((i) => (i + 1) % roles.length)
        setIsDeleting(false)
      }, pauseAfterDelete)
    } else if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1))
      }, deleteSpeed)
    } else {
      timeout = setTimeout(() => {
        setDisplayText(currentRole.slice(0, displayText.length + 1))
      }, typeSpeed)
    }
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentRole, roles, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete])

  return displayText
}

function TypewriterRole() {
  const text = useTypewriterRotation(ROTATING_ROLES)
  return (
    <span className="inline-flex items-baseline">
      <span className="text-gradient-theme">{text}</span>
      <span
        aria-hidden
        className="ml-0.5 inline-block w-[2px] h-[1em] bg-primary align-middle animate-[blink_1s_steps(2)_infinite]"
      />
    </span>
  )
}

function Avatar({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const dim = size === 'lg' ? 'h-24 w-24 text-3xl' : 'h-12 w-12 text-lg'
  return (
    <div
      className={`${dim} rounded-full bg-gradient-theme-r text-primary-foreground font-display font-bold flex items-center justify-center shadow-lg shadow-primary/20`}
      aria-label={profile.name}
    >
      {profile.initials}
    </div>
  )
}

function FloatingControls() {
  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2">
      <Link
        to="/about"
        className="inline-flex items-center h-10 px-4 rounded-full bg-card/80 backdrop-blur-md border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors shadow-md"
      >
        About
      </Link>
      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors shadow-md"
      >
        <Github className="w-4 h-4" />
      </a>
      <a
        href={`mailto:${profile.email}`}
        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
      >
        <Mail className="w-4 h-4" /> Contact
      </a>
    </div>
  )
}

const HOME_TOC_SECTIONS = [
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Recognition' },
  { id: 'contact', label: 'Contact' },
] as const

function HomeToc() {
  const [activeId, setActiveId] = useState<string>('')
  const [tocOpen, setTocOpen] = useState(false)
  const [inBody, setInBody] = useState(false)

  useEffect(() => {
    const ids = HOME_TOC_SECTIONS.map((s) => s.id)
    const handler = () => {
      const y = window.scrollY + 200
      let current = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= y) current = id
      }
      setActiveId(current)
      const firstSection = document.getElementById(ids[0])
      setInBody(firstSection ? window.scrollY + 120 >= firstSection.offsetTop : false)
    }
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const activeIdx = HOME_TOC_SECTIONS.findIndex((s) => s.id === activeId)
  const progress = activeIdx < 0 ? 0 : ((activeIdx + 1) / HOME_TOC_SECTIONS.length) * 100

  const tocNav = (
    <nav aria-label="On this page" className="relative pl-3">
      <div className="absolute left-[5.5px] top-[14px] w-px bg-border" style={{ height: 'calc(100% - 28px)' }} />
      <motion.div
        className="absolute left-[5.5px] top-[14px] w-px bg-primary origin-top"
        style={{ height: 'calc(100% - 28px)' }}
        animate={{ scaleY: progress / 100 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      <ul className="space-y-1">
        {HOME_TOC_SECTIONS.map((section) => {
          const isActive = section.id === activeId
          return (
            <li key={section.id} className="relative flex items-center gap-2.5">
              <span
                className={`relative z-10 h-3 w-3 rounded-full border-2 transition-colors ${
                  isActive ? 'bg-primary border-primary' : 'bg-background border-border'
                }`}
              />
              <a
                href={`#${section.id}`}
                onClick={() => setTocOpen(false)}
                className={`text-left text-[13px] tracking-wide py-1 transition-all duration-300 ${
                  isActive
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {section.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )

  return (
    <>
      <AnimatePresence>
        {inBody && (
          <motion.aside
            key="toc-desktop"
            aria-label="Section navigation"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="hidden xl:block fixed top-28 left-[max(1.5rem,calc(50%-40rem))] w-40 z-30"
          >
            {tocNav}
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {inBody && (
          <motion.button
            key="toc-mobile-btn"
            onClick={() => setTocOpen((o) => !o)}
            aria-label="Open section menu"
            aria-expanded={tocOpen}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-card/80 backdrop-blur-md border border-border flex flex-col items-center justify-center gap-[3px] shadow-md hover:border-primary/50 transition-colors"
          >
            <span className="block w-4 h-[2px] bg-foreground rounded" />
            <span className="block w-4 h-[2px] bg-foreground rounded" />
            <span className="block w-4 h-[2px] bg-foreground rounded" />
          </motion.button>
        )}
      </AnimatePresence>

      {tocOpen && inBody && (
        <>
          <button
            aria-label="Close section menu"
            className="xl:hidden fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            onClick={() => setTocOpen(false)}
          />
          <div className="xl:hidden fixed top-16 left-4 z-50 bg-card border border-border rounded-2xl p-5 shadow-xl">
            {tocNav}
          </div>
        </>
      )}
    </>
  )
}

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const heroItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

function HeroOrbs() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-32 -left-32 h-[32rem] w-[32rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(closest-side, hsl(142 72% 45% / 0.25), transparent)' }}
        animate={{ x: [0, 60, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-20 -right-40 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(closest-side, hsl(160 84% 39% / 0.22), transparent)' }}
        animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute bottom-[-10rem] left-1/3 h-[26rem] w-[26rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(closest-side, hsl(141 79% 70% / 0.18), transparent)' }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <HeroOrbs />
      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate="visible"
        className="relative max-w-5xl mx-auto px-6 py-20 sm:py-28 flex flex-col items-start gap-6"
      >
        <motion.div variants={heroItem} whileHover={{ scale: 1.04, rotate: -2 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
          <Avatar />
        </motion.div>

        <motion.div variants={heroItem} className="flex items-center gap-2 text-sm text-primary font-medium">
          <motion.span
            className="inline-block h-2 w-2 rounded-full bg-primary"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span>{hero.eyebrow}</span>
        </motion.div>

        <motion.h1
          variants={heroItem}
          className="font-display font-bold text-5xl sm:text-6xl tracking-tight text-foreground leading-[1.05]"
        >
          <span className="text-gradient-theme bg-[length:200%_auto] animate-[shimmer_6s_ease-in-out_infinite]">
            {hero.title}
          </span>
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="text-2xl sm:text-3xl font-display font-semibold text-foreground min-h-[2.5rem] sm:min-h-[3rem]"
        >
          <TypewriterRole />
        </motion.p>

        <motion.p variants={heroItem} className="text-xl text-foreground max-w-2xl">
          {hero.subtitle}
        </motion.p>

        <motion.p variants={heroItem} className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          {hero.description}
        </motion.p>

        <motion.div variants={heroItem} className="flex flex-wrap items-center gap-3 mt-4">
          <motion.a
            href={`mailto:${profile.email}`}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
          >
            <Mail className="h-4 w-4" />
            {hero.ctaPrimary}
          </motion.a>
          <motion.a
            href="#experience"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-primary/50 text-primary hover:bg-primary/10 transition-colors"
          >
            {hero.ctaSecondary}
          </motion.a>
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileText className="h-4 w-4" />
            Resume
          </a>
        </motion.div>

        <motion.div variants={heroItem} className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {profile.location}</span>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground" aria-label="GitHub">
            <Github className="h-4 w-4" /> GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground" aria-label="LinkedIn">
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}

function Experience() {
  return (
    <section id="experience" className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-2">Experience</h2>
      <p className="text-muted-foreground mb-10">7+ years building production AI systems.</p>
      <div className="space-y-8">
        {experience.map((role) => (
          <article key={role.company + role.period} className="group relative pl-6 sm:pl-8 border-l-2 border-primary/20 hover:border-primary transition-colors">
            <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-primary" />
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
              <h3 className="font-display font-semibold text-xl text-foreground">
                {role.title} <span className="text-primary">@ {role.company}</span>
              </h3>
              <span className="text-sm text-muted-foreground whitespace-nowrap">{role.period}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{role.location}</p>
            <ul className="space-y-1.5 mb-3">
              {role.highlights.map((h, i) => (
                <li key={i} className="text-sm text-foreground leading-relaxed flex gap-2">
                  <span className="text-primary mt-1 select-none">›</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5">
              {role.stack.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-2">Skills</h2>
      <p className="text-muted-foreground mb-10">Tools I reach for every week.</p>
      <div className="grid sm:grid-cols-2 gap-6">
        {skills.map((group) => (
          <div key={group.label} className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-display font-semibold text-sm text-primary uppercase tracking-wide mb-3">
              {group.label}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span key={item} className="text-sm px-2.5 py-1 rounded-lg bg-primary/5 text-foreground border border-primary/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Achievements() {
  return (
    <section id="achievements" className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-2">Recognition</h2>
      <p className="text-muted-foreground mb-10">Open source, competitions, and credentials.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {achievements.map((a) => (
          <div key={a.label} className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-foreground">{a.label}</p>
              <p className="text-sm text-muted-foreground">{a.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="max-w-5xl mx-auto px-6 py-20">
      <div className="bg-gradient-theme-r text-primary-foreground rounded-3xl p-10 sm:p-14">
        <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3">Let's build something with AI.</h2>
        <p className="text-lg opacity-90 max-w-xl mb-6">
          Open to senior AI engineering roles, advisory, and interesting collaborations.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-primary font-semibold hover:bg-white/90 transition-colors"
          >
            <Mail className="h-4 w-4" />
            {profile.email}
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/40 text-white hover:bg-white/10 transition-colors"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/40 text-white hover:bg-white/10 transition-colors"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>{footer.rights}</p>
        <p>{footer.built}</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <FloatingControls />
      <HomeToc />
      <main className="min-h-screen">
        <div className="relative bg-card shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.25)] border-b-2 border-primary/20">
          <Hero />
        </div>
        <div className="bg-background bg-[length:24px_24px] [background-image:radial-gradient(circle,hsl(var(--dot-grid))_1px,transparent_1px)]">
          <Experience />
          <Skills />
          <Achievements />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  )
}
