import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Github, Linkedin, GraduationCap, Award, ExternalLink, House, ChevronRight } from 'lucide-react'
import { profile, footer } from './i18n'
import { about } from './about-i18n'

function Nav() {
  return (
    <nav className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border" />
      <div className="relative max-w-3xl mx-auto pt-4 pb-3 px-6 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 text-sm">
          <Link to="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <House className="w-4 h-4" />
            <span className="hidden sm:inline">{profile.name}</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
          <span className="text-foreground font-medium">About</span>
        </div>
        <a
          href={`mailto:${profile.email}`}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Mail className="w-4 h-4" /> Contact
        </a>
      </div>
    </nav>
  )
}

export default function AboutPage() {
  useEffect(() => {
    document.title = `About — ${profile.name}`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', about.intro)
  }, [])

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-6">
          {about.title}
        </h1>
        <p className="text-xl text-foreground mb-10 leading-relaxed">{about.intro}</p>

        <div className="space-y-5 mb-14">
          {about.story.map((paragraph, i) => (
            <p key={i} className="text-base text-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <section className="mb-14">
          <h2 className="font-display font-bold text-2xl text-foreground mb-5 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" /> Education
          </h2>
          <ul className="space-y-3">
            {about.education.map((e) => (
              <li key={e.label} className="bg-card border border-border rounded-xl p-4">
                <p className="font-medium text-foreground">{e.label}</p>
                <p className="text-sm text-muted-foreground">{e.org} · {e.period}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14">
          <h2 className="font-display font-bold text-2xl text-foreground mb-5 flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" /> Certifications
          </h2>
          <ul className="space-y-3">
            {about.certifications.map((c) => (
              <li key={c.label} className="bg-card border border-border rounded-xl p-4">
                <p className="font-medium text-foreground">{c.label}</p>
                <p className="text-sm text-muted-foreground">{c.org} · {c.period}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14">
          <h2 className="font-display font-bold text-2xl text-foreground mb-5">Open Source</h2>
          <ul className="space-y-3">
            {about.openSource.map((p) => (
              <li key={p.name} className="bg-card border border-border rounded-xl p-4">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  {p.name}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14">
          <h2 className="font-display font-bold text-2xl text-foreground mb-5">Speaking & Mentorship</h2>
          <ul className="space-y-3">
            {about.speaking.map((s) => (
              <li key={s.label} className="bg-card border border-border rounded-xl p-4">
                <p className="font-medium text-foreground">{s.label}</p>
                <p className="text-sm text-muted-foreground">{s.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14">
          <h2 className="font-display font-bold text-2xl text-foreground mb-5">FAQ</h2>
          <div className="space-y-4">
            {about.faq.map((item) => (
              <details key={item.q} className="group bg-card border border-border rounded-xl p-5">
                <summary className="font-medium text-foreground cursor-pointer list-none flex items-center justify-between">
                  <span>{item.q}</span>
                  <span className="text-primary group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="bg-gradient-theme-r text-primary-foreground rounded-3xl p-8 sm:p-10">
          <h2 className="font-display font-bold text-2xl mb-3">Let's talk.</h2>
          <p className="text-base opacity-90 mb-5 max-w-lg">
            Have a role, a project, or just want to chat about LLM systems? Email me or find me on LinkedIn / GitHub.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-primary font-semibold hover:bg-white/90 transition-colors"
            >
              <Mail className="h-4 w-4" />
              {profile.email}
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/40 text-white hover:bg-white/10 transition-colors">
              <Github className="h-4 w-4" /> GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/40 text-white hover:bg-white/10 transition-colors">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>{footer.rights}</p>
          <p>{footer.built}</p>
        </div>
      </footer>
    </>
  )
}
