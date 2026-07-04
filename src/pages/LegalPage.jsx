import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function LegalPage({ title, updated, sections }) {
  return (
    <div className="min-h-screen bg-background text-ink">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Ante
        </Link>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary-light/80 mt-12 mb-3">
          Last updated — {updated}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">{title}</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60 mt-4">
          Placeholder template — have counsel review before launch.
        </p>
        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-xl font-semibold mb-2.5">{s.h}</h2>
              <p className="text-muted text-sm leading-relaxed">{s.p}</p>
            </section>
          ))}
        </div>
        <div className="border-t border-divider mt-16 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
          © 2026 Ante (working title)
        </div>
      </div>
    </div>
  )
}
