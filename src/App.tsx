import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Github, Linkedin, Mail, MapPin, FileText, ArrowUpRight, Moon, Sun } from 'lucide-react'
import {
  profile,
  hero,
  experience,
  skills,
  footer,
  rolePills,
  stats,
  projects,
  communities,
  certs,
  heroMeta,
  whoami,
} from './i18n'

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
  const dim = size === 'lg' ? 'h-24 w-24' : 'h-12 w-12'
  return (
    <img
      src="/pray.jpg"
      alt={profile.name}
      className={`${dim} rounded-full object-cover ring-2 ring-primary/30 shadow-lg shadow-primary/20`}
    />
  )
}

function useDarkMode() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    return (localStorage.getItem('pray-theme') as 'light' | 'dark') || 'light'
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('pray-theme', theme)
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))] as const
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 h-[2px] z-[60] bg-gradient-theme-r transition-[width] duration-100 shadow-[0_0_8px_hsl(var(--primary)/0.5)]"
      style={{ width: `${progress}%` }}
    />
  )
}

function FloatingControls({ theme, toggleTheme }: { theme: 'light' | 'dark'; toggleTheme: () => void }) {
  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors shadow-md"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
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
  { id: 'projects', label: 'Projects' },
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
        style={{ background: 'radial-gradient(closest-side, hsl(var(--primary) / 0.25), transparent)' }}
        animate={{ x: [0, 60, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-20 -right-40 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(closest-side, hsl(var(--accent) / 0.22), transparent)' }}
        animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute bottom-[-10rem] left-1/3 h-[26rem] w-[26rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(closest-side, hsl(var(--primary) / 0.18), transparent)' }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  )
}

function MetaStrip() {
  return (
    <div
      aria-hidden
      className="font-mono text-[11px] text-muted-foreground tracking-wide flex gap-5 flex-wrap pb-2.5 mb-5 border-b border-dashed border-primary/20"
    >
      {heroMeta.map((item) => (
        <span key={item.k} className="inline-flex gap-1.5 items-center">
          {item.dot && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse-ring" />
          )}
          <span className="opacity-70">{item.k}:</span>
          <span className="text-foreground">{item.v}</span>
        </span>
      ))}
    </div>
  )
}

function RolePills() {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {rolePills.map((label, i) => (
        <span
          key={label}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/5 text-[13px] font-medium text-primary hover:bg-primary/10 hover:border-primary/50 hover:-translate-y-0.5 transition animate-pill-in"
          style={{ animationDelay: `${0.05 + i * 0.05}s` }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary/70" />
          {label}
        </span>
      ))}
    </div>
  )
}

function Whoami() {
  return (
    <div className="mt-6 max-w-[640px] font-mono text-[13px] text-muted-foreground bg-primary/5 border border-border rounded-[10px] px-3.5 py-2.5 flex gap-2.5 items-center flex-wrap">
      <span className="text-primary font-semibold">{whoami.prompt}</span>
      <span>$</span>
      <span className="text-foreground">{whoami.cmd}</span>
      <span className="opacity-60">→</span>
      <span>{whoami.output}</span>
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
        <motion.div variants={heroItem} className="w-full">
          <MetaStrip />
        </motion.div>

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

        <motion.div variants={heroItem} className="w-full">
          <RolePills />
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

        <motion.div variants={heroItem} className="w-full">
          <Whoami />
        </motion.div>

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

function StatStrip() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 bg-card border-y border-border divide-x divide-y sm:divide-y-0 divide-border">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group relative px-6 py-7 flex flex-col gap-1 overflow-hidden transition-colors hover:bg-primary/5"
        >
          <span className="font-display font-bold text-3xl sm:text-4xl leading-none text-gradient-theme">
            {stat.value}
          </span>
          <span className="text-[13px] text-muted-foreground font-medium">{stat.label}</span>
          <span className="font-mono text-[10px] text-primary/70 tracking-wide mt-0.5">{stat.sub}</span>
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-theme-r origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>
      ))}
    </div>
  )
}

function SectionHead({ title, num, total, tag, subtitle }: { title: string; num: string; total: string; tag: string; subtitle?: string }) {
  return (
    <>
      <div className="flex items-baseline justify-between gap-4 mb-2 flex-wrap">
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight">{title}</h2>
        <div className="font-mono text-xs text-muted-foreground tracking-[0.15em]">
          {num}
          <span className="text-primary/40 mx-1">/</span>
          {total} · {tag}
        </div>
      </div>
      {subtitle && <p className="text-muted-foreground mb-10 text-[15px]">{subtitle}</p>}
    </>
  )
}

function renderHighlight(text: string): ReactNode[] {
  const parts = text.split(/(\[\[[^\]]+\]\])/g)
  return parts.map((part, i) => {
    const m = part.match(/^\[\[([^\]]+)\]\]$/)
    if (m) {
      return (
        <span
          key={i}
          className="font-mono font-semibold text-primary bg-primary/8 rounded px-1.5 py-0.5 text-[13px]"
        >
          {m[1]}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function Experience() {
  return (
    <section id="experience" className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
      <SectionHead title="Experience" num="01" total="05" tag="EXP" subtitle="7+ years building production AI systems." />
      <div className="flex flex-col gap-8">
        {experience.map((role) => (
          <article
            key={role.company + role.period}
            className="group relative pl-7 border-l-2 border-primary/20 hover:border-primary transition-colors"
          >
            <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-primary" />
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-1">
              <h3 className="font-display font-semibold text-xl text-foreground">
                {role.title} <span className="text-primary">@ {role.company}</span>
              </h3>
              <span className="font-mono text-xs text-muted-foreground tracking-wide whitespace-nowrap">
                {role.period}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{role.location}</p>
            <ul className="flex flex-col gap-1.5 mb-3">
              {role.highlights.map((h, i) => (
                <li key={i} className="text-[14.5px] text-foreground leading-relaxed flex gap-2">
                  <span className="text-primary mt-1 select-none shrink-0">›</span>
                  <span>{renderHighlight(h)}</span>
                </li>
              ))}
            </ul>
            <div className="font-mono text-[11.5px] text-muted-foreground tracking-wide mb-2">
              <span className="opacity-60">stack ›</span> {role.stack.join(' · ').toLowerCase()}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {role.stack.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border"
                >
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
    <section id="skills" className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
      <SectionHead title="Skills" num="02" total="05" tag="STACK" subtitle="Tools I reach for every week." />
      <div className="grid sm:grid-cols-2 gap-6">
        {skills.map((group) => (
          <div
            key={group.label}
            className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:-translate-y-0.5 transition"
          >
            <h3 className="font-display font-semibold text-[12px] text-primary uppercase tracking-[0.08em] mb-3 flex items-center gap-2">
              <span className="font-mono text-muted-foreground/70 font-medium">$</span>
              {group.label}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="text-[13px] px-2.5 py-1 rounded-lg bg-primary/5 text-foreground border border-primary/20"
                >
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

function Projects() {
  return (
    <section id="projects" className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
      <SectionHead
        title="Projects"
        num="03"
        total="05"
        tag="PROJECTS"
        subtitle="Selected personal and open-source work."
      />
      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map((p) => (
          <article
            key={p.name}
            className="group bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:border-primary/35 hover:-translate-y-0.5 transition"
          >
            {p.image && (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-[16/10] overflow-hidden bg-muted/50 border-b border-border"
                aria-hidden
                tabIndex={-1}
              >
                <img
                  src={p.image}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </a>
            )}
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="font-display font-semibold text-base mb-1">{p.name}</div>
                  <p className="text-[13.5px] text-muted-foreground leading-normal">{p.description}</p>
                </div>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${p.name}`}
                  className="shrink-0 w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
              <span className="inline-flex self-start font-mono font-semibold text-primary bg-primary/8 rounded px-1.5 py-0.5 text-[13px]">
                {p.metric}
              </span>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {p.stack.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Achievements() {
  return (
    <section id="achievements" className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
      <SectionHead
        title="Recognition"
        num="04"
        total="05"
        tag="WINS"
        subtitle="Open source, competitions, and credentials."
      />

      <div className="grid sm:grid-cols-3 gap-3">
        {communities.map((c) => (
          <div
            key={c.title}
            className="bg-card border border-border rounded-2xl p-4.5 flex flex-col gap-2.5 hover:border-primary/35 hover:-translate-y-0.5 transition"
            style={{ padding: '18px' }}
          >
            <div className="font-mono text-[10px] tracking-[0.1em] text-primary uppercase font-semibold">
              {c.tag}
            </div>
            <div className="font-semibold text-[14px] text-foreground leading-snug">{c.title}</div>
            <p className="text-[12.5px] text-muted-foreground leading-relaxed">{c.sub}</p>
            <div className="flex gap-3 mt-auto font-mono text-[11px] text-muted-foreground">
              {c.metrics.map((m) => (
                <div key={m.label}>
                  <strong className="font-display text-[20px] leading-none text-gradient-theme block">
                    {m.value}
                  </strong>
                  {m.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground mt-9 mb-4">
        Certifications & Education
      </h3>
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {certs.map((c) => (
          <div
            key={c.name}
            className="bg-card border border-border rounded-xl px-4 py-3.5 flex items-center gap-3 hover:border-primary/35 hover:-translate-y-0.5 transition"
          >
            <div className="w-10 h-10 rounded-[10px] shrink-0 flex items-center justify-center font-mono text-[11px] font-bold text-primary-foreground bg-gradient-theme-br">
              {c.icon}
            </div>
            <div>
              <div className="text-[13px] font-semibold text-foreground leading-tight">{c.name}</div>
              <div className="text-[12px] text-muted-foreground mt-0.5">{c.issuer}</div>
              <div className="font-mono text-[10px] text-primary/70 mt-0.5">{c.year}</div>
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
      <div className="sec-head flex items-baseline justify-end gap-4 mb-4 flex-wrap">
        <div className="font-mono text-xs text-muted-foreground tracking-[0.15em]">
          05<span className="text-primary/40 mx-1">/</span>05 · CONTACT
        </div>
      </div>
      <div className="relative overflow-hidden bg-gradient-theme-r text-primary-foreground rounded-3xl p-10 sm:p-14">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'linear-gradient(135deg, rgba(0,0,0,0.9), transparent 70%)',
          }}
        />
        <div className="relative">
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
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-muted-foreground font-mono">
        <p>{footer.rights}</p>
        <p>{footer.built}</p>
      </div>
    </footer>
  )
}

export default function App() {
  const [theme, toggleTheme] = useDarkMode()
  return (
    <>
      <ScrollProgress />
      <FloatingControls theme={theme} toggleTheme={toggleTheme} />
      <HomeToc />
      <main className="min-h-screen">
        <div className="relative bg-card shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.25)] border-b-2 border-primary/20">
          <Hero />
        </div>
        <StatStrip />
        <div className="bg-background bg-[length:24px_24px] [background-image:radial-gradient(circle,hsl(var(--dot-grid))_1px,transparent_1px)]">
          <Experience />
          <Skills />
          <Projects />
          <Achievements />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  )
}
