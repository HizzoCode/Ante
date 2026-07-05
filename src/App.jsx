import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowUpRight, ArrowRight, Menu, X, Check, CheckCircle2, Plus, Loader2,
  AlertTriangle, MousePointer2, Camera, Sunrise, Dumbbell, Smartphone,
  Pizza, Timer, Footprints, Scale, ShieldCheck, Handshake, ChevronDown,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const NAV_LINKS = [
  { label: 'How it works', href: '#how' },
  { label: 'Stakes', href: '#stakes' },
  { label: 'Why it works', href: '#why' },
  { label: 'FAQ', href: '#faq' },
]

const STAKE_OPTIONS = [
  { value: 'gym', label: 'Gym & training consistency' },
  { value: 'wake', label: 'Waking up early' },
  { value: 'screen', label: 'Screen time / doomscrolling' },
  { value: 'study', label: 'Studying & deep work' },
  { value: 'other', label: 'Something else…' },
]

const WEBHOOK_URL = import.meta.env.VITE_WAITLIST_WEBHOOK_URL || ''

async function submitWaitlist(payload) {
  const params = new URLSearchParams(window.location.search)
  const body = {
    ...payload,
    utm_source: params.get('utm_source') || 'direct',
    utm_medium: params.get('utm_medium') || '',
    utm_content: params.get('utm_content') || '',
    page: 'landing-v1',
    ts: new Date().toISOString(),
  }
  if (WEBHOOK_URL) {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('webhook failed')
  } else {
    // Demo mode — set VITE_WAITLIST_WEBHOOK_URL to store signups (n8n webhook ready)
    console.log('[Ante waitlist — demo mode]', body)
    await new Promise((r) => setTimeout(r, 900))
  }
}

/* ---------------------------------- logo ---------------------------------- */

function Logo({ size = 'md' }) {
  const box = size === 'md' ? 'h-9 w-9 rounded-xl text-lg' : 'h-8 w-8 rounded-lg text-base'
  return (
    <a href="#home" className="flex items-center gap-2.5">
      <span className={`${box} bg-primary text-deep font-display font-bold flex items-center justify-center`}>A</span>
      <span className="font-display font-bold tracking-[0.18em] text-ink">ANTE</span>
    </a>
  )
}

/* --------------------------------- navbar --------------------------------- */

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'glass shadow-xl shadow-black/40' : 'bg-transparent border border-transparent'
        }`}
      >
        <Logo />
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted hover:text-ink transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#waitlist"
            className="magnetic-btn hidden sm:inline-flex items-center gap-1.5 bg-primary text-deep px-5 py-2.5 rounded-full text-sm font-semibold"
          >
            Get early access <ArrowUpRight className="h-4 w-4" />
          </a>
          <button
            className="lg:hidden p-2 text-ink"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] glass-dark flex flex-col items-center justify-center gap-8">
          <button className="absolute top-6 right-6 p-2 text-ink" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-6 w-6" />
          </button>
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display text-3xl text-ink hover:text-primary-light transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#waitlist"
            onClick={() => setOpen(false)}
            className="magnetic-btn mt-4 inline-flex items-center gap-2 bg-primary text-deep px-7 py-3.5 rounded-full font-semibold"
          >
            Get early access <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </>
  )
}

/* -------------------------------- receipts -------------------------------- */

function TearEdge({ color = '#F4F1E8' }) {
  let d = 'M0 0'
  for (let x = 0; x < 320; x += 20) d += ` L${x + 10} 12 L${x + 20} 0`
  d += ' Z'
  return (
    <svg viewBox="0 0 320 12" preserveAspectRatio="none" className="block w-full" style={{ height: 12 }} aria-hidden="true">
      <path d={d} fill={color} />
    </svg>
  )
}

const BARCODE = [3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1]

function Barcode() {
  return (
    <div className="flex items-end gap-[2px] h-7 mt-3" aria-hidden="true">
      {BARCODE.map((w, i) => (
        <span key={i} className="bg-paper-ink/80" style={{ width: w, height: i % 5 === 0 ? '100%' : '80%' }} />
      ))}
    </div>
  )
}

function ReceiptRow({ k, v, accent }) {
  return (
    <div className="flex justify-between gap-4 py-[3px]">
      <span className="text-paper-muted">{k}</span>
      <span className={`text-right font-semibold ${accent || ''}`}>{v}</span>
    </div>
  )
}

function LossReceipt() {
  return (
    <div className="hero-receipt relative w-[290px] sm:w-[325px] -rotate-3" style={{ willChange: 'clip-path' }}>
      <div className="bg-paper text-paper-ink font-mono text-[11px] px-6 pt-6 pb-4 rounded-t-md shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
        <p className="text-center font-bold tracking-[0.45em] text-sm">ANTE</p>
        <p className="text-center text-[8px] tracking-[0.3em] text-paper-muted mt-1">HABIT CONTRACT — RESULT</p>
        <div className="border-b border-dashed border-paper-ink/25 my-3" />
        <ReceiptRow k="RECEIPT" v="#4,102" />
        <ReceiptRow k="PLAYER" v="MARKO K." />
        <ReceiptRow k="CONTRACT" v={'"GYM BEFORE WORK, MON–FRI"'} />
        <ReceiptRow k="STAKE" v="€50.00" />
        <ReceiptRow k="DEADLINE" v="FRI 07:30" />
        <ReceiptRow k="PROOF" v="NONE — 07:31 ✗" accent="text-loss-dark" />
        <div className="border-b border-dashed border-paper-ink/25 my-3" />
        <p className="text-[9px] tracking-[0.25em] text-paper-muted mb-1">SPLIT 3 WAYS</p>
        <ReceiptRow k="ANA S." v="+€16.67" accent="text-primary-dark" />
        <ReceiptRow k="LUKA B." v="+€16.67" accent="text-primary-dark" />
        <ReceiptRow k="IVAN P." v="+€16.66" accent="text-primary-dark" />
        <div className="border-b border-dashed border-paper-ink/25 my-3" />
        <p className="text-[9px] text-paper-muted">
          REASON GIVEN: <span className="italic">"IT WAS RAINING"</span>
        </p>
        <Barcode />
        <p className="text-[8px] tracking-[0.2em] text-paper-muted mt-2">NO APPEAL FILED · ANTE.APP</p>
        <div className="hero-stamp absolute top-[88px] -right-2 rotate-[-12deg] border-[3px] border-loss text-loss px-3 py-1 rounded font-bold tracking-[0.18em] text-lg opacity-90">
          FORFEIT −€50
        </div>
      </div>
      <TearEdge />
    </div>
  )
}

function KeptReceipt() {
  return (
    <div className="relative w-[260px]">
      <div className="bg-paper text-paper-ink font-mono text-[10px] px-5 pt-5 pb-3 rounded-t-md shadow-2xl">
        <p className="text-center font-bold tracking-[0.45em] text-xs">ANTE</p>
        <div className="border-b border-dashed border-paper-ink/25 my-2.5" />
        <ReceiptRow k="PLAYER" v="ANA S." />
        <ReceiptRow k="CONTRACT" v={'"6AM CLUB — WK 4"'} />
        <ReceiptRow k="RESULT" v="7/7 CLEAR ✓" accent="text-primary-dark" />
        <div className="border-b border-dashed border-paper-ink/25 my-2.5" />
        <div className="rotate-[8deg] border-[3px] border-primary-dark text-primary-dark px-2.5 py-0.5 rounded font-bold tracking-[0.15em] text-sm w-max mx-auto my-2">
          PAID OUT +€66.67
        </div>
      </div>
      <TearEdge />
    </div>
  )
}

/* ---------------------------------- hero ----------------------------------- */

const HERO_CHIPS = [
  { top: '16%', right: '8%', delay: '0s', size: 34 },
  { top: '30%', right: '20%', delay: '1.4s', size: 24 },
  { top: '10%', right: '30%', delay: '2.6s', size: 18 },
  { top: '42%', right: '5%', delay: '3.4s', size: 20 },
]

function Hero() {
  const ref = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-line-1', { y: 40, opacity: 0, duration: 1, delay: 0.3, ease: 'power3.out' })
      gsap.from('.hero-line-2', { y: 60, opacity: 0, duration: 1.2, delay: 0.5, ease: 'power3.out' })
      gsap.from('.hero-cta, .hero-meta', { y: 24, opacity: 0, duration: 0.8, delay: 0.8, stagger: 0.12, ease: 'power3.out' })
      gsap.fromTo(
        '.hero-receipt',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 -8% 0)', duration: 1.7, delay: 1.0, ease: 'power2.inOut' }
      )
      gsap.fromTo(
        '.hero-stamp',
        { scale: 2.4, opacity: 0, rotation: -30 },
        { scale: 1, opacity: 0.9, rotation: -12, duration: 0.3, delay: 2.7, ease: 'power4.in' }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="home" ref={ref} className="relative min-h-[100dvh] overflow-hidden flex items-center">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute -top-48 -left-48 h-[38rem] w-[38rem] rounded-full bg-primary/10 blur-[150px]" />
      <div className="absolute -bottom-24 -right-24 h-[30rem] w-[30rem] rounded-full bg-loss/[0.06] blur-[130px]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-divider to-transparent" />

      {HERO_CHIPS.map((c, i) => (
        <div
          key={i}
          className="hidden lg:flex absolute items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary-light font-mono animate-float"
          style={{ top: c.top, right: c.right, width: c.size, height: c.size, fontSize: c.size * 0.42, animationDelay: c.delay }}
          aria-hidden="true"
        >
          €
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-32 pb-24 w-full">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <p className="hero-meta font-mono text-[11px] uppercase tracking-[0.3em] text-primary-light/80 mb-6">
              Skin in the game — waitlist open
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] text-balance">
              <span className="hero-line-1 block">Miss a habit,</span>
              <span className="hero-line-2 block font-serif italic font-medium gradient-text pb-2">pay your friends.</span>
            </h1>
            <p className="hero-meta mt-7 max-w-xl text-muted text-base sm:text-lg leading-relaxed">
              Ante puts real money on your habits. Squad up, everyone stakes €50 on the week.
              Send proof when you show up — AI checks it in seconds. Whoever slacks funds the ones who didn't.
            </p>
            <div className="hero-cta mt-9 max-w-xl">
              <WaitlistForm compact />
            </div>
            <p className="hero-meta mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">
              Free to join · First 500 get founding pricing · 18+
            </p>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[440px]">
            <div className="absolute rotate-[7deg] translate-x-14 -translate-y-8 opacity-60 scale-[0.94] animate-float" style={{ animationDelay: '1.2s' }}>
              <KeptReceipt />
            </div>
            <div className="relative animate-float">
              <LossReceipt />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 z-10">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted/60">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-primary/60 to-transparent" />
      </div>
    </section>
  )
}

/* --------------------------------- ticker --------------------------------- */

const TICKER = [
  { t: 'Marko forfeited €50 — gym, Friday 07:31', bad: true },
  { t: 'Ana collected €66.67 — 6AM club, week 4' },
  { t: 'Ivan paid €5 — 38 min TikTok overtime', bad: true },
  { t: 'Squad “Leg Day Liars” pot hit €400' },
  { t: 'Luka kept his €100 — 20 km done, Sunday 19:58' },
  { t: 'Sara forfeited €25 — delivery app detected', bad: true },
  { t: 'Nina collected €33.34 — deep work, 14 days clean' },
]

function TickerBar() {
  return (
    <section className="relative border-y border-divider bg-surface/60 py-3 overflow-hidden">
      <div className="flex items-center max-w-full">
        <span className="relative z-10 shrink-0 ml-4 sm:ml-8 mr-6 font-mono text-[9px] uppercase tracking-[0.2em] text-muted border border-divider rounded-full px-3 py-1.5 bg-background whitespace-nowrap">
          From the table — simulated · you're early
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker-track">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span key={i} className="flex items-center gap-2 font-mono text-xs text-muted whitespace-nowrap">
                <span className={`h-1.5 w-1.5 rounded-full ${item.bad ? 'bg-loss' : 'bg-primary'}`} />
                {item.t}
              </span>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------- feature card animations ------------------------- */

const MINI_RECEIPTS = [
  { result: 'FORFEIT −€50', bad: true, player: 'MARKO K.', line: 'GYM — FRI 07:31 ✗', sub: 'SPLIT 3 WAYS → SQUAD' },
  { result: 'PAID OUT +€66.67', bad: false, player: 'ANA S.', line: '6AM CLUB — WEEK 4 ✓', sub: 'FUNDED BY 1 FORFEIT' },
  { result: 'FORFEIT −€5', bad: true, player: 'IVAN P.', line: '38 MIN TIKTOK OVERTIME', sub: 'PAID TO THE TABLE' },
]

const SHUFFLE_POS = [
  'z-30 translate-y-2 scale-100 opacity-100',
  'z-20 -translate-y-4 scale-[0.94] opacity-50 blur-[1px]',
  'z-10 -translate-y-9 scale-[0.88] opacity-25 blur-[2px]',
]

function ReceiptShuffler() {
  const [order, setOrder] = useState([0, 1, 2])
  useEffect(() => {
    const id = setInterval(() => setOrder(([a, b, c]) => [b, c, a]), 3000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="relative h-44 rounded-2xl bg-deep border border-divider overflow-hidden flex items-center justify-center">
      {MINI_RECEIPTS.map((r, i) => {
        const pos = order.indexOf(i)
        return (
          <div
            key={i}
            className={`absolute w-56 bg-paper text-paper-ink font-mono rounded-sm px-4 py-3 transition-all duration-700 ${SHUFFLE_POS[pos]}`}
          >
            <p className={`font-bold text-[11px] tracking-wide ${r.bad ? 'text-loss-dark' : 'text-primary-dark'}`}>{r.result}</p>
            <p className="text-[9px] text-paper-muted mt-1">{r.player}</p>
            <p className="text-[9px] mt-0.5">{r.line}</p>
            <div className="border-b border-dashed border-paper-ink/25 my-2" />
            <p className="text-[8px] tracking-[0.15em] text-paper-muted">{r.sub}</p>
          </div>
        )
      })}
    </div>
  )
}

const POT_STATES = [
  'Marko anted €50 — locked ✓',
  'Ana anted €50 — locked ✓',
  'Pot €200 · 4 players · till Sunday',
  'Luka missed leg day — €50 to the table',
  'Payout Sunday 20:00 — Ana +€66.67',
]

const POT_CHIPS = [
  { left: '18%', delay: 0, dur: 2.6, s: 14 },
  { left: '32%', delay: 0.9, dur: 3.1, s: 11 },
  { left: '47%', delay: 1.7, dur: 2.8, s: 13 },
  { left: '59%', delay: 0.4, dur: 3.3, s: 10 },
  { left: '71%', delay: 2.1, dur: 2.7, s: 12 },
  { left: '83%', delay: 1.2, dur: 3.0, s: 11 },
  { left: '26%', delay: 2.6, dur: 2.9, s: 10 },
]

function PotAnim() {
  const [state, setState] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setState((s) => (s + 1) % POT_STATES.length), 2300)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="relative h-44 rounded-2xl overflow-hidden bg-gradient-to-b from-[#0B120E] to-[#0E1A14] border border-divider">
      <div className="absolute top-0 inset-x-0 flex justify-between px-4 pt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-primary-light/70">
        <span>Squad pot</span>
        <span>€200 locked</span>
      </div>
      <div className="absolute top-9 inset-x-0 flex justify-center gap-3">
        {['MA', 'AN', 'LU', 'IV'].map((n) => (
          <span key={n} className="h-6 w-6 rounded-full bg-primary/15 border border-primary/40 text-primary-light text-[8px] font-mono flex items-center justify-center">
            {n}
          </span>
        ))}
      </div>
      {POT_CHIPS.map((c, i) => (
        <span
          key={i}
          className="absolute top-[58px] rounded-full border border-primary-light/60 bg-primary/20 text-primary-light font-mono flex items-center justify-center"
          style={{
            left: c.left,
            width: c.s,
            height: c.s,
            fontSize: 7,
            animation: `rain-fall ${c.dur}s linear ${c.delay}s infinite`,
          }}
          aria-hidden="true"
        >
          €
        </span>
      ))}
      <svg className="absolute bottom-9 left-0 w-full" height="14" viewBox="0 0 400 14" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 7 Q 25 0 50 7 T 100 7 T 150 7 T 200 7 T 250 7 T 300 7 T 350 7 T 400 7"
          fill="none"
          stroke="rgba(52,211,153,0.5)"
          strokeWidth="1.5"
        />
      </svg>
      {[{ l: '25%', d: 0.6 }, { l: '50%', d: 1.5 }, { l: '75%', d: 2.4 }].map((r, i) => (
        <span
          key={i}
          className="absolute bottom-[42px] h-3 w-6 rounded-full border border-primary-light/50"
          style={{ left: r.l, animation: `rain-ripple 2.4s ease-out ${r.d}s infinite` }}
          aria-hidden="true"
        />
      ))}
      <div className="absolute bottom-0 inset-x-0 px-4 pb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-primary ring-pulse" />
        <span key={state} className="font-mono text-[9px] text-muted" style={{ animation: 'rain-fadein 0.5s ease' }}>
          {POT_STATES[state]}
        </span>
      </div>
    </div>
  )
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const PROOF_PHASES = ['Awaiting proof…', 'Fresh capture received 07:02', 'AI verifying…', 'Verified ✓ 0.8s — no charge']

function ProofCheck() {
  const [pos, setPos] = useState({ day: 2, phase: 0 })
  useEffect(() => {
    const id = setInterval(() => {
      setPos(({ day, phase }) => (phase < 3 ? { day, phase: phase + 1 } : { day: (day + 1) % 7, phase: 0 }))
    }, 950)
    return () => clearInterval(id)
  }, [])
  const { day, phase } = pos
  return (
    <div className="relative h-44 rounded-2xl overflow-hidden bg-deep border border-divider p-4">
      <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-primary-light/70 mb-3">
        <span>Proof log — week 27</span>
        <span>AI + human appeal</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {DAYS.map((d, i) => (
          <div
            key={i}
            className={`relative h-14 rounded-lg border flex flex-col items-center justify-center gap-0.5 font-mono text-[9px] overflow-hidden transition-colors duration-300 ${
              i < day
                ? 'border-primary/40 bg-primary/10 text-primary-light'
                : i === day
                ? 'border-primary-light bg-surface-2 text-ink'
                : 'border-divider text-muted/40'
            }`}
          >
            <span>{d}</span>
            {i < day && <Check className="h-3 w-3" />}
            {i === day && phase <= 1 && <Camera className="h-3.5 w-3.5 text-muted" />}
            {i === day && phase === 1 && <span className="text-[7px] text-muted">07:02</span>}
            {i === day && phase === 2 && (
              <>
                <Camera className="h-3.5 w-3.5 text-muted" />
                <span
                  className="absolute inset-y-0 w-5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                  style={{ animation: 'scan-sweep 0.9s linear infinite' }}
                />
              </>
            )}
            {i === day && phase === 3 && <Check className="h-3.5 w-3.5 text-primary-light" />}
          </div>
        ))}
      </div>
      <MousePointer2
        className="absolute h-4 w-4 text-ink drop-shadow-lg"
        style={{
          left: `calc(${(day + 0.72) * 14.28}% - 10px)`,
          top: 86,
          transition: 'left 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      />
      <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${phase === 3 ? 'bg-primary' : 'bg-muted/50'}`} />
        <span key={phase} className="font-mono text-[9px] text-muted" style={{ animation: 'rain-fadein 0.4s ease' }}>
          {PROOF_PHASES[phase]}
        </span>
      </div>
    </div>
  )
}

/* -------------------------------- features -------------------------------- */

const FEATURES = [
  {
    eyebrow: '01 — Consequences',
    title: 'Receipts, not streaks.',
    Anim: ReceiptShuffler,
    text: 'A missed day isn’t a gray square. It’s a document — who, what, how much, and where the money went. Screenshot-able. Group-chat-ready. Undeniable.',
    bullets: ['Sent to your squad, instantly', 'Painfully specific', 'Wins print too'],
  },
  {
    eyebrow: '02 — The pot',
    title: 'Everyone antes. Sunday pays.',
    Anim: PotAnim,
    text: 'Squad pots lock Monday morning. Every miss redistributes to the players who showed up. Finish clean and their failure literally funds your consistency.',
    bullets: ['Pots lock for the week', 'Misses redistribute automatically', 'Winners split, to the cent'],
  },
  {
    eyebrow: '03 — Verification',
    title: 'Proof or it didn’t happen.',
    Anim: ProofCheck,
    text: 'Photo, GPS, screen-time report, watch data — fresh capture only. AI verifies in seconds, and a human hears every appeal before a cent moves.',
    bullets: ['Fresh-capture only, metadata checked', 'AI verdict in under a second', 'Human appeal before any charge'],
  },
]

function Features() {
  const ref = useRef(null)
  useEffect(() => {
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} className="relative py-28 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary-light/80 mb-4">The mechanism</p>
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl">
          Built to sting <span className="font-serif italic font-medium gradient-text">exactly enough.</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-14">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card rounded-3xl bg-surface border border-divider p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary-light/70">{f.eyebrow}</p>
              <h3 className="font-display text-xl font-semibold mt-1.5 mb-6">{f.title}</h3>
              <f.Anim />
              <p className="text-muted text-sm leading-relaxed mt-6">{f.text}</p>
              <ul className="mt-5 space-y-2">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 font-mono text-xs text-muted">
                    <Check className="h-3 w-3 text-primary shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- pillars --------------------------------- */

function CountUp({ end, suffix = '', duration = 2000 }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTs = performance.now()
          const tick = (now) => {
            const t = Math.min(1, (now - startTs) / duration)
            const eased = 1 - Math.pow(1 - t, 3)
            setValue(Math.round(end * eased))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])
  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  )
}

const PILLARS = [
  {
    label: 'Loss aversion',
    end: 2,
    suffix: '×',
    accent: true,
    text: 'Losing €50 hurts about twice as much as winning €50 feels good — the most replicated result in behavioral economics. Every casino runs on it. Now it works for you.',
  },
  {
    label: 'With money staked',
    end: 90,
    suffix: '%+',
    accent: true,
    text: 'Follow-through reported across money-staked goal apps. Skin in the game finishes what motivation only starts.',
  },
  {
    label: 'Without stakes',
    end: 20,
    suffix: '%',
    accent: false,
    text: 'Roughly where free habit trackers land. A gray square costs nothing — so it changes nothing.',
  },
]

function Pillars() {
  return (
    <section id="why" className="relative py-28 sm:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[130px]" />
      <div className="absolute bottom-0 right-1/5 h-64 w-64 rounded-full bg-loss/[0.05] blur-[120px]" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary-light/80 mb-4">Why it works</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Casino mechanics, <span className="font-serif italic font-medium gradient-text">gym outcomes.</span>
          </h2>
        </div>
        <div className="grid lg:grid-cols-3 lg:divide-x divide-divider border-y border-divider mt-16">
          {PILLARS.map((p, i) => (
            <div key={p.label} className="px-8 sm:px-10 py-12">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">{p.label}</p>
              <p className={`font-display text-6xl sm:text-7xl font-bold mt-4 ${p.accent ? 'gradient-text' : 'text-muted/60'}`}>
                <CountUp end={p.end} suffix={p.suffix} />
              </p>
              <p className="text-muted text-sm leading-relaxed mt-5">{p.text}</p>
              <div className="relative h-px bg-divider overflow-hidden mt-8">
                <span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"
                  style={{ animation: `pillar-sweep 3s ease-in-out ${i * 0.6}s infinite` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-center font-mono text-[10px] text-muted/60 mt-10 max-w-2xl mx-auto leading-relaxed">
          Loss aversion ≈ 2×: Kahneman & Tversky (1979). Completion rates as reported across money-staked goal apps — we'll publish our own after beta.
        </p>
      </div>
    </section>
  )
}

/* -------------------------------- protocol --------------------------------- */

function StepVisualTable() {
  return (
    <div className="rounded-3xl bg-deep border border-divider p-6 font-mono text-xs">
      <p className="text-[9px] uppercase tracking-[0.25em] text-primary-light/70 mb-3">The table</p>
      {[['MARKO', '€50'], ['ANA', '€50'], ['LUKA', '€50'], ['IVAN', '€50']].map(([n, v]) => (
        <div key={n} className="flex justify-between border-b border-divider/60 py-2.5">
          <span className="text-muted">{n}</span>
          <span className="text-primary-light">{v} ✓</span>
        </div>
      ))}
      <div className="flex justify-between items-center pt-3.5">
        <span className="text-[10px] text-muted">POT — LOCKED TILL SUN</span>
        <span className="text-primary-light font-bold text-base">€200</span>
      </div>
    </div>
  )
}

function StepVisualProof() {
  return (
    <div className="rounded-3xl bg-deep border border-divider p-6 font-mono text-xs">
      <p className="text-[9px] uppercase tracking-[0.25em] text-primary-light/70 mb-3">Evidence</p>
      <div className="relative h-28 rounded-xl bg-gradient-to-br from-surface-2 to-deep border border-divider flex items-center justify-center">
        <Dumbbell className="h-7 w-7 text-muted" />
        <span className="absolute bottom-2 right-2 text-[8px] border border-primary/50 text-primary-light rounded px-1.5 py-0.5">
          FRESH · 07:02
        </span>
      </div>
      <div className="flex justify-between border-b border-divider/60 py-2.5 mt-2">
        <span className="text-muted">AI CHECK</span>
        <span className="text-primary-light">VERIFIED — 0.8s ✓</span>
      </div>
      <div className="flex justify-between pt-2.5">
        <span className="text-muted">APPEAL</span>
        <span className="text-ink/80">HUMAN — ALWAYS OPEN</span>
      </div>
    </div>
  )
}

function StepVisualPayout() {
  return (
    <div className="rounded-3xl bg-deep border border-divider p-6 font-mono text-xs">
      <p className="text-[9px] uppercase tracking-[0.25em] text-primary-light/70 mb-3">Payout — Sun 20:00</p>
      {[['ANA', '+€66.67', false], ['LUKA', '+€66.67', false], ['IVAN', '+€66.66', false], ['MARKO', '−€50.00', true]].map(([n, v, bad]) => (
        <div key={n} className="flex justify-between border-b border-divider/60 py-2.5">
          <span className="text-muted">{n}</span>
          <span className={bad ? 'text-loss' : 'text-primary-light'}>{v}</span>
        </div>
      ))}
      <p className="text-[10px] text-muted pt-3.5">RECEIPTS SENT TO SQUAD CHAT ✓</p>
    </div>
  )
}

const STEPS = [
  {
    n: '01',
    title: 'Ante up.',
    text: 'Pick the habit, the stake, and the squad. Gym four times a week, €50 each, you and three friends. No squad? Stake solo — hit it or the money’s gone.',
    bullets: ['Any habit, any proof, any stake', 'Stakes capped — pain, not ruin', 'Solo mode: you vs. you'],
    Visual: StepVisualTable,
  },
  {
    n: '02',
    title: 'Prove it.',
    text: 'Photo, screen-time report, GPS, screenshot — whatever fits the habit. AI verifies in seconds. No judges, no honor system, no “I’ll log it later.”',
    bullets: ['Fresh-capture only', 'Verified in under a second', 'Disputes go to a human, first'],
    Visual: StepVisualProof,
  },
  {
    n: '03',
    title: 'Payout Sunday.',
    text: 'Finish the week and you keep your stake — plus a split of whatever the slackers left behind. Every result generates a receipt. Screenshot it. Send it. Frame it.',
    bullets: ['Winners split to the cent', 'Receipts hit the squad chat', 'New table opens Monday'],
    Visual: StepVisualPayout,
  },
]

function Protocol() {
  const ref = useRef(null)
  useEffect(() => {
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.protocol-card').forEach((card, i, arr) => {
        if (i === arr.length - 1) return
        gsap.to(card, {
          scrollTrigger: { trigger: card, start: 'top top+=110', end: '+=500', scrub: 1 },
          scale: 0.92,
          filter: 'blur(6px) saturate(0.7)',
          opacity: 0.45,
          ease: 'none',
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="how" ref={ref} className="relative py-28 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary-light/80 mb-4">How it works</p>
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
          Three steps. <span className="font-serif italic font-medium gradient-text">No mercy.</span>
        </h2>
        <div className="mt-16">
          {STEPS.map((s, i) => (
            <div key={s.n} className={i < STEPS.length - 1 ? 'mb-[38vh]' : ''}>
              <div className="protocol-card sticky top-24 rounded-4xl border border-divider bg-surface p-8 sm:p-12 grid lg:grid-cols-5 gap-10 items-center shadow-2xl shadow-black/40">
                <div className="lg:col-span-3">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-primary-light/70 text-sm">STEP {s.n}</span>
                    <span className="h-px flex-1 bg-divider" />
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl font-bold mt-4">{s.title}</h3>
                  <p className="text-muted leading-relaxed mt-4 max-w-lg">{s.text}</p>
                  <ul className="mt-6 space-y-2.5">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2.5 font-mono text-xs text-muted">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:col-span-2">
                  <s.Visual />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- stakes grid -------------------------------- */

const STAKES = [
  { icon: Sunrise, title: 'The 6AM Club', proof: 'Selfie before 6:05 — metadata checked.', price: '€10/day' },
  { icon: Dumbbell, title: 'Gym 4×/week', proof: 'Geotag or it didn’t happen.', price: '€50/week' },
  { icon: Smartphone, title: 'Screen time under 2h', proof: 'Daily screen-time screenshot.', price: '€5/fail' },
  { icon: Pizza, title: 'No delivery apps', proof: 'Bank feed says otherwise? Pay up.', price: '€25/week' },
  { icon: Timer, title: 'Deep work, 2h daily', proof: 'Focus tracker proof, every session.', price: '€15/day' },
  { icon: Footprints, title: '20 km per week', proof: 'Watch data, synced by Sunday night.', price: '€40/week' },
]

function StakesGrid() {
  const ref = useRef(null)
  useEffect(() => {
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from('.svc-tile', {
        scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="stakes" ref={ref} className="relative bg-deep border-y border-divider py-28 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary-light/80 mb-4">Starter contracts</p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Pick your <span className="font-serif italic font-medium gradient-text">poison.</span>
          </h2>
          <p className="text-muted text-sm max-w-sm leading-relaxed">
            Six starters — or write your own contract. Any habit, any proof, any stake.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-divider/70 rounded-3xl overflow-hidden border border-divider mt-14">
          {STAKES.map((s) => (
            <div key={s.title} className="svc-tile group bg-deep p-8 sm:p-10 hover:bg-white/[0.03] transition-colors">
              <div className="flex items-start justify-between">
                <span className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 text-primary-light flex items-center justify-center transition-transform group-hover:scale-110">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-[10px] text-primary-light/80 border border-primary/25 rounded-full px-2.5 py-1">
                  {s.price}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold mt-5">{s.title}</h3>
              <p className="text-muted text-sm mt-1.5 leading-relaxed">{s.proof}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ trust signals ------------------------------- */

const TRUST = [
  {
    icon: Scale,
    title: 'You are the house',
    text: 'No dice, no odds, no chance. Whether you lose is decided entirely by whether you show up — which is exactly why this isn’t gambling. 18+ anyway.',
  },
  {
    icon: ShieldCheck,
    title: 'Humans before charges',
    text: 'AI verifies, but every rejection can be appealed to a person before a cent moves. We never charge silently.',
  },
  {
    icon: Handshake,
    title: 'We charge the table, not the loser',
    text: 'A small rake on pots plus an optional membership. We make money when you play — not when you fail. We’d rather you win.',
  },
]

function TrustSignals() {
  const ref = useRef(null)
  useEffect(() => {
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from('.trust-card', {
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} className="py-24">
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {TRUST.map((t) => (
            <div key={t.title} className="trust-card rounded-2.5xl bg-surface border border-divider p-8 lift-on-hover">
              <t.icon className="h-9 w-9 text-primary" />
              <h3 className="font-display text-lg font-semibold mt-4">{t.title}</h3>
              <p className="text-muted text-sm leading-relaxed mt-2">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------- FAQ ------------------------------------ */

const FAQS = [
  {
    q: 'Is this gambling?',
    a: 'No. Gambling needs chance. There’s none here — whether you lose money is 100% decided by whether you do the thing you said you’d do. You are the house. 18+, not available where prohibited.',
  },
  {
    q: 'What if I did the habit but the AI rejects my proof?',
    a: 'Every rejection can be appealed to a human before any money moves. We never charge silently, and evidence disputes resolve in your favor unless it’s clear-cut.',
  },
  {
    q: 'How does Ante make money?',
    a: 'A small cut of squad pots and an optional membership — the way a poker room charges the table, not the loser. We make money when you play, not when you fail.',
  },
  {
    q: 'Where does the money go if I fail solo?',
    a: 'Never to us. Before you start, you pick where solo forfeits go — a charity, or better, an anti-charity: a cause you’d hate to fund. Sleep through your 6AM run and your €50 goes to your rival football club’s youth academy. Suddenly the alarm works. (Squad forfeits always go to your squad.)',
  },
  {
    q: 'What stops someone from faking proof?',
    a: 'Fresh-capture photo requirements, metadata checks, and AI that’s seen every trick. Also: cheating your own gym pot is a genuinely sad thing to do to yourself.',
  },
  {
    q: 'When does it launch?',
    a: 'Solo stakes first, squad pots right after. The waitlist gets in first, in order — and the first 500 get founding pricing.',
  },
]

function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="py-28 sm:py-32">
      <div className="max-w-3xl mx-auto px-6 sm:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary-light/80 mb-4 text-center">FAQ</p>
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-center">
          The fine print, <span className="font-serif italic font-medium gradient-text">out loud.</span>
        </h2>
        <div className="mt-14 border-t border-divider">
          {FAQS.map((f, i) => (
            <div key={f.q} className="border-b border-divider">
              <button
                className="w-full flex items-center justify-between gap-6 py-6 text-left"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
              >
                <span className="font-display text-base sm:text-lg font-medium">{f.q}</span>
                <Plus
                  className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}
                />
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="text-muted text-sm leading-relaxed pb-6 max-w-xl">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- waitlist ---------------------------------- */

function WaitlistForm({ compact = false }) {
  const [status, setStatus] = useState('idle')
  const [email, setEmail] = useState('')
  const [pick, setPick] = useState('')
  const [other, setOther] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      await submitWaitlist({
        email,
        stake_pick: pick,
        stake_other: pick === 'other' ? other : '',
        variant: compact ? 'hero' : 'footer',
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent' && compact) {
    return (
      <div className="glass rounded-full px-6 py-4 flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
        <p className="text-sm">
          <span className="font-semibold">You're in.</span>{' '}
          <span className="text-muted">Founding spot secured — watch your inbox.</span>
        </p>
      </div>
    )
  }

  if (status === 'sent') {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
        <h3 className="font-display text-2xl font-bold mt-5">You're in.</h3>
        <p className="text-muted text-sm mt-2 max-w-xs mx-auto leading-relaxed">
          Founding spot secured. We'll email you when solo stakes open — bring a squad.
        </p>
      </div>
    )
  }

  const inputCls =
    'w-full rounded-xl bg-deep border border-divider px-4 py-3.5 text-sm placeholder:text-muted/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition'

  if (compact) {
    return (
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="flex-1 min-w-0 rounded-full glass px-5 py-3.5 text-sm placeholder:text-muted/50 focus:outline-none focus:border-primary/60 transition"
        />
        <div className="relative sm:w-56">
          <select
            required
            value={pick}
            onChange={(e) => setPick(e.target.value)}
            className={`w-full appearance-none rounded-full glass px-5 py-3.5 pr-10 text-sm focus:outline-none focus:border-primary/60 transition ${pick ? 'text-ink' : 'text-muted/60'}`}
          >
            <option value="" disabled>
              I'd stake money on…
            </option>
            {STAKE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-surface text-ink">
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        </div>
        <button
          type="submit"
          className="magnetic-btn shrink-0 inline-flex items-center justify-center gap-2 bg-primary text-deep px-6 py-3.5 rounded-full text-sm font-semibold shadow-lg shadow-primary/25"
        >
          {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {status === 'sending' ? 'Locking…' : 'Claim early access'}
        </button>
        {status === 'error' && (
          <p className="sm:w-full flex items-center gap-1.5 text-xs text-loss">
            <AlertTriangle className="h-3.5 w-3.5" /> Something broke — try again.
          </p>
        )}
      </form>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-2">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className={inputCls}
        />
      </div>
      <div>
        <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-2">
          What would you put money on?
        </label>
        <div className="relative">
          <select
            required
            value={pick}
            onChange={(e) => setPick(e.target.value)}
            className={`${inputCls} appearance-none pr-10 ${pick ? 'text-ink' : 'text-muted/60'}`}
          >
            <option value="" disabled>
              Choose your battle
            </option>
            {STAKE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-surface text-ink">
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        </div>
      </div>
      {pick === 'other' && (
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-2">Name it</label>
          <input
            type="text"
            value={other}
            onChange={(e) => setOther(e.target.value)}
            placeholder="Any habit counts — quitting vapes, cold calls, 10k words…"
            className={inputCls}
          />
        </div>
      )}
      <button
        type="submit"
        className="magnetic-btn w-full inline-flex items-center justify-center gap-2 bg-primary text-deep rounded-2xl py-4 font-semibold shadow-lg shadow-primary/25"
      >
        {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {status === 'sending' ? 'Locking your spot…' : 'Claim early access'}
        {status !== 'sending' && <ArrowRight className="h-4 w-4" />}
      </button>
      {status === 'error' && (
        <p className="flex items-center gap-1.5 text-xs text-loss">
          <AlertTriangle className="h-3.5 w-3.5" /> Something broke — try again, or email hello@ante.app.
        </p>
      )}
      <p className="text-[11px] text-muted/60 leading-relaxed">
        No spam, no sharing — launch updates only. Unsubscribe anytime.
      </p>
    </form>
  )
}

function WaitlistSection() {
  return (
    <section id="waitlist" className="relative py-28 sm:py-32 overflow-hidden">
      <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-primary/10 blur-[150px]" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary-light/80 mb-4">Waitlist open</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-balance">
            Put your money where your <span className="font-serif italic font-medium gradient-text">mouth is.</span>
          </h2>
          <p className="text-muted leading-relaxed mt-5 max-w-md">
            Solo stakes first, squad pots right after. The waitlist gets in first, in order.
          </p>
          <div className="glass rounded-full px-4 py-2 w-max mt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-light">First 500 → founding pricing</p>
          </div>
          <p className="text-[11px] text-muted/60 leading-relaxed mt-8 max-w-sm">
            18+. Void where prohibited. Outcomes are determined solely by your own actions — no element of chance.
            Stakes are capped. Charges only occur after evidence review, with a human appeal available.
          </p>
        </div>
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-surface border border-divider p-8 sm:p-10 shadow-2xl shadow-black/40">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- footer ----------------------------------- */

function Footer() {
  return (
    <footer className="bg-deep border-t border-divider pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="text-muted text-sm leading-relaxed mt-4 max-w-xs">
              Real money on the line. Real habits, finally. Building in public — waitlist open.
            </p>
            <div className="flex items-center gap-2.5 mt-6">
              <span className="h-2 w-2 rounded-full bg-primary ring-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Waitlist open — landing v1</span>
            </div>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-4">Explore</p>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-muted hover:text-ink transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#waitlist" className="text-primary-light hover:text-primary transition-colors">
                  Get early access
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-4">Legal</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="text-muted hover:text-ink transition-colors">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted hover:text-ink transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-4">The fine print</p>
            <p className="text-[11px] text-muted/70 leading-relaxed">
              18+. Void where prohibited. No element of chance — outcomes depend solely on your own actions.
              Stakes are capped. Charges only after evidence review, with human appeal. Not financial advice; barely lifestyle advice.
            </p>
          </div>
        </div>
        <div className="border-t border-divider mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
          <span>© 2026 Ante (working title)</span>
          <span>Miss a habit, pay your friends.</span>
        </div>
      </div>
    </footer>
  )
}

/* ----------------------------------- app ------------------------------------ */

export default function App() {
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => clearTimeout(id)
  }, [])
  return (
    <div className="relative">
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <Hero />
        <TickerBar />
        <Features />
        <Pillars />
        <Protocol />
        <StakesGrid />
        <TrustSignals />
        <FAQ />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  )
}
