import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowUpRight, ArrowRight, Menu, X, Check, CheckCircle2, Plus, Loader2,
  AlertTriangle, Camera, Sunrise, Dumbbell, Smartphone, Pizza, Timer,
  Footprints, ShieldCheck, Scale, Handshake, ChevronDown, Bell, Flame,
  MapPin, Users, Zap,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const NAV_LINKS = [
  { label: 'How it works', href: '#how' },
  { label: 'The squad chat', href: '#table' },
  { label: 'Why it works', href: '#why' },
  { label: 'Contracts', href: '#contracts' },
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
    page: 'landing-v2',
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
    console.log('[Ante waitlist — demo mode]', body)
    await new Promise((r) => setTimeout(r, 900))
  }
}

/* ---------------------------------- nav ----------------------------------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'border-b border-line-warm bg-sand/85 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className="font-clash text-xl font-semibold tracking-[0.04em] text-ink-warm">
            Ante<span className="text-pine">.</span>
          </a>
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-muted-warm transition-colors hover:text-ink-warm">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#waitlist"
              className="hidden items-center gap-1.5 rounded-full bg-ink-warm px-5 py-2.5 text-sm font-medium text-sand transition-colors hover:bg-pine sm:inline-flex"
            >
              Get early access <ArrowUpRight className="h-4 w-4" />
            </a>
            <button className="p-2 text-ink-warm lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-7 bg-sand/95 backdrop-blur-xl">
          <button className="absolute right-6 top-6 p-2 text-ink-warm" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-6 w-6" />
          </button>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-clash text-3xl font-medium text-ink-warm transition-colors hover:text-pine">
              {l.label}
            </a>
          ))}
          <a
            href="#waitlist"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink-warm px-7 py-3.5 font-medium text-sand"
          >
            Get early access <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </>
  )
}

/* ----------------------------- evidence scenes ----------------------------- */

function DumbbellPair({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-9" y="-1.5" width="18" height="3" rx="1.5" fill="#4A5850" />
      <circle cx="-9" cy="0" r="5.5" fill="#28322C" stroke="#4A5850" strokeWidth="1.5" />
      <circle cx="9" cy="0" r="5.5" fill="#28322C" stroke="#4A5850" strokeWidth="1.5" />
    </g>
  )
}

/* proof-viewfinder scene (≈3:2) — a gym interior that reads as a real photo */
function GymScene() {
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" className="block h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="v2gymBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#242B23" />
          <stop offset="1" stopColor="#0B0E0B" />
        </linearGradient>
        <linearGradient id="v2gymFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#191F19" />
          <stop offset="1" stopColor="#0D100D" />
        </linearGradient>
      </defs>
      <rect width="200" height="130" fill="url(#v2gymBg)" />
      {/* ceiling light strips */}
      <rect x="30" y="8" width="52" height="4" rx="2" fill="#F1E6C8" opacity="0.9" />
      <rect x="120" y="8" width="52" height="4" rx="2" fill="#F1E6C8" opacity="0.9" />
      <ellipse cx="56" cy="22" rx="40" ry="14" fill="rgba(241,230,200,0.10)" />
      <ellipse cx="146" cy="22" rx="40" ry="14" fill="rgba(241,230,200,0.10)" />
      {/* mirror wall */}
      <rect x="14" y="30" width="172" height="58" fill="rgba(242,245,243,0.05)" />
      <line x1="14" y1="30" x2="186" y2="30" stroke="rgba(242,245,243,0.14)" strokeWidth="1.5" />
      <line x1="100" y1="30" x2="100" y2="88" stroke="rgba(242,245,243,0.08)" strokeWidth="1" />
      {/* dumbbell rack, two shelves */}
      <line x1="26" y1="66" x2="96" y2="66" stroke="#3A453C" strokeWidth="3" />
      <line x1="26" y1="84" x2="96" y2="84" stroke="#3A453C" strokeWidth="3" />
      <rect x="27" y="64" width="3" height="26" fill="#2E3830" />
      <rect x="92" y="64" width="3" height="26" fill="#2E3830" />
      <DumbbellPair x={42} y={60} s={0.85} />
      <DumbbellPair x={64} y={60} s={0.85} />
      <DumbbellPair x={86} y={60} s={0.85} />
      <DumbbellPair x={42} y={78} s={0.85} />
      <DumbbellPair x={64} y={78} s={0.85} />
      {/* bench */}
      <rect x="120" y="72" width="58" height="7" rx="3" fill="#2C3630" />
      <rect x="124" y="79" width="4" height="16" fill="#232B25" />
      <rect x="168" y="79" width="4" height="16" fill="#232B25" />
      <rect x="140" y="52" width="6" height="22" fill="#232B25" transform="rotate(18 143 63)" />
      {/* barbell resting on bench uprights */}
      <rect x="112" y="49" width="76" height="3.5" rx="1.75" fill="#48544B" />
      <circle cx="120" cy="50.5" r="8" fill="#1B221C" stroke="#48544B" strokeWidth="2" />
      <circle cx="180" cy="50.5" r="8" fill="#1B221C" stroke="#48544B" strokeWidth="2" />
      {/* floor */}
      <rect x="0" y="95" width="200" height="35" fill="url(#v2gymFloor)" />
      <line x1="0" y1="95" x2="200" y2="95" stroke="rgba(242,245,243,0.12)" strokeWidth="1.5" />
      <line x1="30" y1="130" x2="52" y2="95" stroke="rgba(242,245,243,0.05)" strokeWidth="1" />
      <line x1="100" y1="130" x2="100" y2="95" stroke="rgba(242,245,243,0.05)" strokeWidth="1" />
      <line x1="170" y1="130" x2="148" y2="95" stroke="rgba(242,245,243,0.05)" strokeWidth="1" />
    </svg>
  )
}

/* chat-photo scenes (wide ≈2.6:1) — key content kept in the middle band */
function GymWide() {
  return (
    <svg viewBox="0 0 360 140" preserveAspectRatio="xMidYMid slice" className="block h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="v2gw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#242B23" />
          <stop offset="1" stopColor="#0B0E0B" />
        </linearGradient>
      </defs>
      <rect width="360" height="140" fill="url(#v2gw)" />
      <rect x="40" y="10" width="70" height="4" rx="2" fill="#F1E6C8" opacity="0.9" />
      <rect x="180" y="10" width="70" height="4" rx="2" fill="#F1E6C8" opacity="0.9" />
      <ellipse cx="75" cy="26" rx="55" ry="15" fill="rgba(241,230,200,0.09)" />
      <ellipse cx="215" cy="26" rx="55" ry="15" fill="rgba(241,230,200,0.09)" />
      {/* mirror */}
      <rect x="16" y="34" width="328" height="66" fill="rgba(242,245,243,0.05)" />
      <line x1="16" y1="34" x2="344" y2="34" stroke="rgba(242,245,243,0.14)" strokeWidth="1.5" />
      {/* rack */}
      <line x1="36" y1="72" x2="150" y2="72" stroke="#3A453C" strokeWidth="3" />
      <line x1="36" y1="92" x2="150" y2="92" stroke="#3A453C" strokeWidth="3" />
      <rect x="37" y="70" width="3" height="30" fill="#2E3830" />
      <rect x="146" y="70" width="3" height="30" fill="#2E3830" />
      <DumbbellPair x={56} y={66} />
      <DumbbellPair x={86} y={66} />
      <DumbbellPair x={116} y={66} />
      <DumbbellPair x={56} y={86} />
      <DumbbellPair x={86} y={86} />
      <DumbbellPair x={116} y={86} />
      {/* bench + barbell */}
      <rect x="200" y="80" width="76" height="8" rx="4" fill="#2C3630" />
      <rect x="206" y="88" width="5" height="18" fill="#232B25" />
      <rect x="264" y="88" width="5" height="18" fill="#232B25" />
      <rect x="190" y="54" width="98" height="4" rx="2" fill="#48544B" />
      <circle cx="200" cy="56" r="10" fill="#1B221C" stroke="#48544B" strokeWidth="2.5" />
      <circle cx="278" cy="56" r="10" fill="#1B221C" stroke="#48544B" strokeWidth="2.5" />
      {/* kettlebells right */}
      <circle cx="316" cy="94" r="9" fill="#28322C" stroke="#4A5850" strokeWidth="2" />
      <path d="M311 87 q5 -8 10 0" fill="none" stroke="#4A5850" strokeWidth="2.5" />
      {/* floor */}
      <line x1="0" y1="104" x2="360" y2="104" stroke="rgba(242,245,243,0.12)" strokeWidth="1.5" />
      <rect x="0" y="104" width="360" height="36" fill="rgba(0,0,0,0.35)" />
    </svg>
  )
}

function RunWide() {
  return (
    <svg viewBox="0 0 360 140" preserveAspectRatio="xMidYMid slice" className="block h-full w-full" aria-hidden="true">
      <rect width="360" height="140" fill="#10151A" />
      {/* street grid */}
      {[20, 55, 90, 125].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="360" y2={y} stroke="rgba(242,245,243,0.07)" strokeWidth="3" />
      ))}
      {[60, 130, 200, 270, 330].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="140" stroke="rgba(242,245,243,0.07)" strokeWidth="3" />
      ))}
      <line x1="0" y1="132" x2="230" y2="0" stroke="rgba(242,245,243,0.09)" strokeWidth="5" />
      {/* park */}
      <rect x="272" y="58" width="70" height="50" rx="6" fill="#17251C" />
      <circle cx="290" cy="74" r="5" fill="#1F3326" />
      <circle cx="316" cy="90" r="6" fill="#1F3326" />
      <circle cx="326" cy="70" r="4" fill="#1F3326" />
      {/* route following streets */}
      <path
        d="M36 118 L130 118 L130 74 L200 74 L200 38 L270 38 L270 74 L306 74"
        fill="none"
        stroke="#34D399"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="36" cy="118" r="6.5" fill="#DFAF5F" stroke="#0B0E0B" strokeWidth="2" />
      {/* end pin */}
      <circle cx="306" cy="68" r="8" fill="#10B981" stroke="#0B0E0B" strokeWidth="2" />
      <circle cx="306" cy="68" r="2.8" fill="#0B0E0B" />
      <path d="M306 76 l-4.5 8 h9 z" fill="#10B981" />
    </svg>
  )
}

function ScreenWide() {
  return (
    <svg viewBox="0 0 360 140" preserveAspectRatio="xMidYMid slice" className="block h-full w-full" aria-hidden="true">
      <rect width="360" height="140" fill="#101116" />
      <text x="18" y="34" fill="rgba(242,245,243,0.55)" fontSize="10" letterSpacing="2" fontFamily="JetBrains Mono, monospace">SCREEN TIME · THURSDAY</text>
      <text x="18" y="62" fill="#F2F5F3" fontSize="24" fontWeight="700" fontFamily="JetBrains Mono, monospace">2h 38m</text>
      <text x="18" y="78" fill="rgba(242,245,243,0.4)" fontSize="9" fontFamily="JetBrains Mono, monospace">38m over your limit</text>
      {/* week bars, Thursday busts the limit */}
      {[
        [206, 34, false], [228, 22, false], [250, 40, false], [272, 62, true], [294, 30, false], [316, 26, false], [338, 14, false],
      ].map(([x, h, over]) => (
        <g key={x}>
          <rect x={x} y={118 - h} width="14" height={h} rx="3" fill={over ? '#EF4444' : '#3B82F6'} opacity={over ? 1 : 0.65} />
          <rect x={x} y={118 - h} width="14" height={Math.max(4, h * 0.35)} rx="3" fill={over ? '#F87171' : '#60A5FA'} opacity={over ? 1 : 0.7} />
        </g>
      ))}
      <line x1="198" y1="70" x2="352" y2="70" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="5 4" />
      <text x="198" y="64" fill="#EF4444" fontSize="9" fontFamily="JetBrains Mono, monospace">LIMIT 2H</text>
      <line x1="18" y1="118" x2="342" y2="118" stroke="rgba(242,245,243,0.14)" strokeWidth="1" />
    </svg>
  )
}

function Scene({ kind }) {
  if (kind === 'gym') return <GymScene />
  if (kind === 'gym-wide') return <GymWide />
  if (kind === 'run-wide') return <RunWide />
  return <ScreenWide />
}

/* ------------------------------- phone shell ------------------------------- */

function PhoneShell({ children, className = '' }) {
  return (
    <div className={`relative w-[272px] shrink-0 rounded-[2.7rem] bg-[#171B18] p-2 shadow-[0_36px_70px_-24px_rgba(62,52,30,0.45)] ${className}`}>
      <div className="relative flex h-[560px] flex-col overflow-hidden rounded-[2.1rem] bg-deep">
        <div className="relative flex items-center justify-between px-6 pb-1 pt-3 font-mono text-[9px] text-ink/60">
          <span>09:41</span>
          <span className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
          <span className="tracking-tight">5G ▮▮▮</span>
        </div>
        {children}
        <div className="pointer-events-none absolute bottom-1.5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-white/20" />
      </div>
    </div>
  )
}

function ScreenBtn({ children, ghost = false }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-xl py-3 font-mono text-[10px] uppercase tracking-[0.18em] ${
        ghost ? 'border border-divider text-muted' : 'bg-primary font-semibold text-deep shadow-lg shadow-primary/25'
      }`}
    >
      {children}
    </div>
  )
}

/* ------------------------------- app screens ------------------------------- */

const WEEK_DOTS = [
  { d: 'M', done: true }, { d: 'T', done: true }, { d: 'W', done: true },
  { d: 'T', today: true }, { d: 'F' }, { d: 'S' }, { d: 'S' },
]

function useCountdown(start = 17 * 60 + 43) {
  const [s, setS] = useState(start)
  useEffect(() => {
    if (prefersReducedMotion) return
    const id = setInterval(() => setS((v) => (v > 0 ? v - 1 : start)), 1000)
    return () => clearInterval(id)
  }, [start])
  const h = String(Math.floor(s / 3600)).padStart(2, '0')
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const sec = String(s % 60).padStart(2, '0')
  return `${h}:${m}:${sec}`
}

function ScreenToday() {
  const t = useCountdown()
  return (
    <div className="flex flex-1 flex-col px-4 pb-8 pt-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-muted">Thu 03 Jul</p>
          <p className="font-clash text-lg font-semibold text-ink">Today, Ana.</p>
        </div>
        <span className="relative rounded-full border border-divider p-2 text-muted">
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-loss" />
        </span>
      </div>

      <div className="mt-3 rounded-2xl border border-primary/25 bg-gradient-to-b from-[#0E1712] to-[#0A0F0C] p-4" style={{ animation: prefersReducedMotion ? 'none' : 'v2-pot-glow 4s ease-in-out infinite' }}>
        <div className="flex items-center justify-between">
          <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-primary-light/80">Active contract</p>
          <span className="rounded-full border border-loss/40 bg-loss/10 px-2 py-0.5 font-mono text-[8px] tracking-[0.12em] text-loss">€50 AT RISK</span>
        </div>
        <p className="mt-2 font-clash text-base font-semibold leading-tight text-ink">Gym before work</p>
        <p className="font-mono text-[9px] text-muted">Mon–Fri · photo + geotag · by 07:30</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">Proof due in</span>
          <span className="font-mono text-xl font-bold tabular-nums text-gold-light">{t}</span>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1">
          {WEEK_DOTS.map((w, i) => (
            <div
              key={i}
              className={`flex h-9 flex-col items-center justify-center gap-0.5 rounded-lg border font-mono text-[8px] ${
                w.done
                  ? 'border-primary/40 bg-primary/10 text-primary-light'
                  : w.today
                  ? 'border-gold/60 bg-gold/10 text-gold-light'
                  : 'border-divider text-muted/40'
              }`}
            >
              <span>{w.d}</span>
              {w.done && <Check className="h-2.5 w-2.5" />}
              {w.today && <Camera className="h-2.5 w-2.5" />}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-divider bg-surface px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-primary-light" />
          <span className="font-mono text-[9px] text-muted">LEG DAY LIARS</span>
        </div>
        <span className="font-mono text-[10px] font-bold text-gold-light">POT €200</span>
      </div>

      <div className="mt-auto space-y-2 pt-3">
        <ScreenBtn><Camera className="h-3.5 w-3.5" /> Submit proof</ScreenBtn>
        <div className="flex items-center justify-center gap-1.5 font-mono text-[9px] text-muted">
          <Flame className="h-3 w-3 text-gold" /> 12 days without paying anyone
        </div>
      </div>
    </div>
  )
}

function ScreenStake() {
  return (
    <div className="flex flex-1 flex-col px-4 pb-8 pt-3">
      <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-muted">New ante</p>
      <p className="mt-1 font-clash text-lg font-semibold leading-tight text-ink">Make it hurt a little.</p>

      <div className="mt-3 flex gap-1.5 overflow-hidden">
        {[['Gym', true], ['Wake-up', false], ['Screen time', false], ['Running', false]].map(([c, active]) => (
          <span
            key={c}
            className={`flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[8px] ${
              active ? 'border-primary bg-primary/15 font-bold text-primary-light' : 'border-divider text-muted'
            }`}
          >
            {active && <Check className="h-2.5 w-2.5" />}{c}
          </span>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="font-clash text-5xl font-bold tracking-tight text-ink">
          <span className="align-top text-xl text-muted">€</span>50
        </p>
        <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.25em] text-muted">on the week</p>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {['€10', '€25', '€50', '€100'].map((v) => (
          <span
            key={v}
            className={`rounded-lg border py-1.5 text-center font-mono text-[10px] ${
              v === '€50' ? 'border-gold bg-gold/10 font-bold text-gold-light' : 'border-divider text-muted'
            }`}
          >
            {v}
          </span>
        ))}
      </div>

      <div className="mt-4 space-y-2 font-mono text-[9px]">
        <div className="flex items-center justify-between rounded-xl border border-divider bg-surface px-3.5 py-2.5">
          <span className="flex items-center gap-2 text-muted"><Camera className="h-3 w-3" /> PROOF</span>
          <span className="text-ink">PHOTO + GEOTAG</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-divider bg-surface px-3.5 py-2.5">
          <span className="flex items-center gap-2 text-muted"><Timer className="h-3 w-3" /> DEADLINE</span>
          <span className="text-ink">07:30 DAILY</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-divider bg-surface px-3.5 py-2.5">
          <span className="flex items-center gap-2 text-muted"><Users className="h-3 w-3" /> MODE</span>
          <span className="flex overflow-hidden rounded-md border border-divider text-[8px]">
            <span className="px-2 py-1 text-muted">SOLO</span>
            <span className="bg-primary px-2 py-1 font-bold text-deep">SQUAD</span>
          </span>
        </div>
      </div>

      <div className="mt-auto space-y-2 pt-3">
        <p className="text-center font-mono text-[7px] uppercase tracking-[0.2em] text-muted/70">House rule: stakes are capped — pain, not ruin</p>
        <ScreenBtn>Ante up €50</ScreenBtn>
      </div>
    </div>
  )
}

const PROOF_CHECKS = [
  ['GYM ENVIRONMENT', 'DETECTED'],
  ['TIME WINDOW 05:00–07:30', '07:02'],
  ['CAPTURE FRESHNESS', 'LIVE'],
]

function ScreenProof() {
  return (
    <div className="flex flex-1 flex-col px-4 pb-8 pt-3">
      <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-muted">Proof — gym before work</p>
      <div className="relative mt-2 h-44 overflow-hidden rounded-2xl border border-divider">
        <Scene kind="gym" />
        <span className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full border border-gold/50 bg-black/50 px-2.5 py-0.5 font-mono text-[7px] tracking-[0.25em] text-gold-light">
          FRESH CAPTURE ONLY
        </span>
        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[8px] text-ink/80">THU 07:02:14</span>
        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[8px] text-ink/80">
          <MapPin className="h-2.5 w-2.5 text-primary-light" /> IRON TEMPLE GYM
        </span>
        {['left-2 top-2 border-l-2 border-t-2', 'right-2 top-2 border-r-2 border-t-2', 'left-2 bottom-8 border-l-2 border-b-2', 'right-2 bottom-8 border-r-2 border-b-2'].map((c) => (
          <span key={c} className={`absolute h-4 w-4 border-ink/50 ${c}`} />
        ))}
        {!prefersReducedMotion && (
          <span className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-primary/40 to-transparent" style={{ animation: 'scan-sweep 2.2s linear infinite' }} />
        )}
      </div>

      <div className="mt-3 space-y-1.5">
        {PROOF_CHECKS.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between rounded-lg border border-divider bg-surface px-3 py-2 font-mono text-[8px]">
            <span className="text-muted">{k}</span>
            <span className="flex items-center gap-1 text-primary-light">{v} <Check className="h-2.5 w-2.5" /></span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 py-2.5">
        <Zap className="h-3.5 w-3.5 text-primary-light" />
        <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-primary-light">VERIFIED IN 0.8s</span>
      </div>
      <p className="mt-auto pt-3 text-center font-mono text-[8px] text-muted/70">Wrong call? A human hears every appeal — before any charge.</p>
    </div>
  )
}

function ScreenPayout() {
  return (
    <div className="flex flex-1 flex-col px-4 pb-8 pt-3">
      <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-muted">Sunday 20:00 — settlement</p>
      <p className="mt-1 font-clash text-lg font-semibold text-ink">The table pays.</p>

      <div className="relative mt-3 bg-paper px-4 pb-3 pt-4 font-mono text-[9px] text-paper-ink">
        <p className="text-center text-[10px] font-bold tracking-[0.4em]">ANTE</p>
        <p className="mt-0.5 text-center text-[7px] tracking-[0.25em] text-paper-muted">WEEK 27 — LEG DAY LIARS</p>
        <div className="my-2.5 border-b border-dashed border-paper-ink/25" />
        {[
          ['ANA — 5/5 CLEAR', '+€66.67', false],
          ['LUKA — 5/5 CLEAR', '+€66.67', false],
          ['IVAN — 5/5 CLEAR', '+€66.66', false],
          ['MARKO — FRI 07:31 ✗', '−€50.00', true],
        ].map(([k, v, bad]) => (
          <div key={k} className="flex justify-between py-[3px]">
            <span className="text-paper-muted">{k}</span>
            <span className={`font-semibold ${bad ? 'text-loss-dark' : 'text-primary-dark'}`}>{v}</span>
          </div>
        ))}
        <div className="my-2.5 border-b border-dashed border-paper-ink/25" />
        <p className="text-[7px] tracking-[0.2em] text-paper-muted">RECEIPTS SENT TO SQUAD CHAT · ANTE.APP</p>
        <span className="absolute -right-1 top-10 rotate-[10deg] rounded border-2 border-primary-dark px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] text-primary-dark">
          SETTLED
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2.5 text-center">
          <p className="font-clash text-lg font-bold text-primary-light">+€16.67</p>
          <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-muted">your cut of Marko</p>
        </div>
        <div className="rounded-xl border border-divider bg-surface px-3 py-2.5 text-center">
          <p className="font-clash text-lg font-bold text-ink">5/5</p>
          <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-muted">week cleared</p>
        </div>
      </div>

      <div className="mt-auto space-y-2 pt-3">
        <ScreenBtn>Rack up again — Monday</ScreenBtn>
        <ScreenBtn ghost>Share the receipt</ScreenBtn>
      </div>
    </div>
  )
}

/* ---------------------------------- hero ----------------------------------- */

function Hero() {
  const ref = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-el', { y: 28, opacity: 0, duration: 0.9, stagger: 0.1, delay: 0.15, ease: 'power3.out' })
      gsap.from('.hero-phone', { y: 60, opacity: 0, rotate: 4, duration: 1.2, delay: 0.5, ease: 'power3.out' })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 45% at 82% 0%, rgba(14,124,82,0.09), transparent 65%), radial-gradient(40% 35% at 8% 20%, rgba(184,137,61,0.07), transparent 65%)',
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="hero-el mb-6 inline-flex items-center gap-2.5 rounded-full border border-line-warm bg-sand-card px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-pine">
            <span className="ring-pulse h-1.5 w-1.5 rounded-full bg-pine" /> Waitlist open
          </p>
          <h1 className="hero-el font-clash text-5xl font-semibold leading-[1.02] tracking-tight text-ink-warm sm:text-6xl lg:text-7xl">
            Miss a habit,
            <br />
            <em className="font-editorial font-normal italic text-pine">pay your friends.</em>
          </h1>
          <p className="hero-el mt-7 max-w-xl text-base leading-relaxed text-muted-warm sm:text-lg">
            Ante puts real money on your habits. Squad up, everyone stakes €50 on the week.
            Send proof when you show up — AI checks it in seconds. Whoever slacks funds the
            ones who didn't.
          </p>
          <div className="hero-el mt-9">
            <WaitlistForm compact />
          </div>
          <p className="hero-el mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-warm/80">
            Free to join · First 500 get founding pricing · 18+
          </p>
        </div>

        <div className="hero-phone relative flex justify-center lg:col-span-5 lg:justify-end">
          <div className="absolute -left-4 top-8 hidden h-14 w-14 rotate-[-12deg] items-center justify-center rounded-full border-2 border-dashed border-gold-dark/40 font-clash text-sm font-semibold text-gold-dark xl:flex">
            €50
          </div>
          <PhoneShell className="lg:rotate-2">
            <ScreenToday />
          </PhoneShell>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- ticker --------------------------------- */

const TICKER = [
  { t: 'Marko forfeited €50 — gym, Friday 07:31', bad: true },
  { t: 'Ana collected €66.67 — 6AM club, week 4' },
  { t: 'Ivan paid €5 — 38 min TikTok overtime', bad: true },
  { t: 'Squad "Leg Day Liars" pot hit €400' },
  { t: 'Luka kept his €100 — 20 km done, Sunday 19:58' },
  { t: 'Sara forfeited €25 — delivery app detected', bad: true },
  { t: 'Nina collected €33.34 — deep work, 14 days clean' },
]

function Ticker() {
  return (
    <section className="relative overflow-hidden border-y border-line-warm bg-sand-card py-3">
      <div className="flex max-w-full items-center">
        <span className="relative z-10 ml-4 mr-6 shrink-0 whitespace-nowrap rounded-full border border-line-warm bg-sand px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-warm sm:ml-8">
          From the table — simulated · you're early
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker-track">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span key={i} className="flex items-center gap-2 whitespace-nowrap font-mono text-xs text-muted-warm">
                <span className={`h-1.5 w-1.5 rounded-full ${item.bad ? 'bg-loss' : 'bg-pine'}`} />
                {item.t}
              </span>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-sand-card to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-sand-card to-transparent" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- how it works ------------------------------- */

const STEPS = [
  {
    n: '01',
    title: 'Ante up.',
    text: 'Pick the habit, the stake, and the squad. Gym four times a week, €50 each, you and three friends — the pot locks Monday morning.',
    bullets: ['Any habit, any proof, any stake', 'Stakes capped — pain, not ruin', 'Solo mode: you vs. you'],
    Screen: ScreenStake,
  },
  {
    n: '02',
    title: 'Prove it.',
    text: 'Fresh photo, geotag, screen-time report — whatever fits the habit. AI verifies in under a second, and a human hears every appeal before a cent moves.',
    bullets: ['Fresh-capture only, metadata checked', 'AI verdict in 0.8s', 'Human appeal before any charge'],
    Screen: ScreenProof,
  },
  {
    n: '03',
    title: 'Sunday pays.',
    text: 'Finish the week and you keep your stake — plus a split of whatever the slackers left behind. Every result prints a receipt.',
    bullets: ['Winners split to the cent', 'Receipts hit the squad chat', 'New table opens Monday'],
    Screen: ScreenPayout,
  },
]

function HowItWorks() {
  return (
    <section id="how" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="rise max-w-2xl">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-pine">How it works</p>
          <h2 className="font-clash text-4xl font-semibold tracking-tight text-ink-warm sm:text-5xl">
            Three steps. <em className="font-editorial font-normal italic text-pine">No mercy.</em>
          </h2>
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-3 lg:gap-10">
          {STEPS.map((s) => (
            <div key={s.n} className="rise flex flex-col items-center">
              <PhoneShell>
                <s.Screen />
              </PhoneShell>
              <div className="mt-8 w-full max-w-sm">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-pine">{s.n}</span>
                  <h3 className="font-clash text-2xl font-semibold text-ink-warm">{s.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-warm">{s.text}</p>
                <ul className="mt-5 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2.5 font-mono text-xs text-muted-warm">
                      <Check className="h-3.5 w-3.5 shrink-0 text-pine" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- week at the table ---------------------------- */

const CHAT = [
  { sys: 'Monday — table opens. 4 players anted €50. Pot €200 locked till Sunday 20:00.' },
  { from: 'AN', name: 'Ana', time: 'Tue 06:58', scene: 'gym-wide', stat: 'IRON TEMPLE GYM · 06:58', caption: 'done. never speak to me before 8am', verified: true, react: '🔥 3' },
  { from: 'LU', name: 'Luka', time: 'Tue 07:12', scene: 'run-wide', stat: '5.2 KM · 31:42', caption: 'legs are officially a rumor', verified: true, react: '👟 2' },
  { from: 'IV', name: 'Ivan', time: 'Wed 21:14', scene: 'screen-wide', caption: 'ok this one hurts', receipt: 'FORFEIT −€5 — 38 MIN TIKTOK OVERTIME', react: '💀 2' },
  { from: 'MA', name: 'Marko', time: 'Fri 07:34', bubble: 'guys it was raining 😭', receipt: 'FORFEIT −€50 — NO PROOF BY 07:30', react: '💀 4' },
  { sys: 'Sunday 20:00 — settlement. Ana +€66.67 · Luka +€66.67 · Ivan +€66.66 · Marko −€50.', good: true },
]

function ChatCard() {
  return (
    <div className="w-full max-w-md rounded-3xl border border-line-warm bg-sand-card p-5 shadow-[0_24px_50px_-24px_rgba(62,52,30,0.3)]">
      <div className="mb-4 flex items-center justify-between border-b border-line-warm pb-4">
        <div>
          <p className="font-clash text-base font-semibold text-ink-warm">Leg Day Liars</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-warm">4 players · week 27</p>
        </div>
        <span className="rounded-full border border-gold-dark/40 bg-gold/10 px-3 py-1 font-mono text-[10px] font-bold text-gold-dark">POT €200</span>
      </div>

      <div className="space-y-4">
        {CHAT.map((m, i) => {
          if (m.sys) {
            return (
              <p
                key={i}
                className={`rounded-xl border px-3.5 py-2.5 text-center font-mono text-[10px] leading-relaxed ${
                  m.good ? 'border-pine/30 bg-pine/[0.07] text-pine' : 'border-line-warm bg-sand text-muted-warm'
                }`}
              >
                {m.sys}
              </p>
            )
          }
          return (
            <div key={i} className="flex gap-2.5">
              <span className="mt-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pine/10 font-mono text-[7px] font-bold text-pine">{m.from}</span>
              <div className="min-w-0 flex-1">
                <p className="mb-1 font-mono text-[9px] text-muted-warm">{m.name} · {m.time}</p>
                <div className={`relative ${m.react ? 'mb-2.5' : ''}`}>
                  <div className="overflow-hidden rounded-2xl rounded-bl-md border border-line-warm bg-white/70">
                    {m.scene && (
                      <div className="relative h-24">
                        <Scene kind={m.scene} />
                        {m.stat && (
                          <span className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[7px] tracking-[0.12em] text-ink/90">
                            {m.stat}
                          </span>
                        )}
                        {m.verified && (
                          <span className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[7px] tracking-[0.1em] text-primary-light">
                            <Check className="h-2.5 w-2.5" /> AI VERIFIED · 0.8s
                          </span>
                        )}
                      </div>
                    )}
                    {(m.caption || m.bubble) && <p className="px-3.5 py-2 text-xs leading-snug text-ink-warm">{m.caption || m.bubble}</p>}
                  </div>
                  {m.react && (
                    <span className="absolute -bottom-2.5 left-3 rounded-full border border-line-warm bg-sand px-2 py-0.5 text-[10px] shadow-sm">
                      {m.react}
                    </span>
                  )}
                </div>
                {m.receipt && (
                  <span className="mt-1.5 inline-block rounded-md border border-loss/40 bg-loss/[0.07] px-2 py-1 font-mono text-[8px] tracking-[0.08em] text-loss-dark">
                    {m.receipt}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeekAtTheTable() {
  return (
    <section id="table" className="border-t border-line-warm bg-sand-card/50 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-start gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <div className="rise lg:sticky lg:top-32">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-pine">The squad chat</p>
          <h2 className="font-clash text-4xl font-semibold tracking-tight text-ink-warm sm:text-5xl">
            A week at <em className="font-editorial font-normal italic text-pine">the table.</em>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-warm">
            Every proof, every excuse, every cent lands in the squad chat — verified before it
            gets there. By Sunday night nobody argues about who owes whom: the receipts
            already said it.
          </p>
          <a
            href="#waitlist"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-ink-warm px-6 py-3.5 text-sm font-medium text-sand transition-colors hover:bg-pine"
          >
            Get a seat at the table <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <div className="rise flex justify-center lg:justify-end">
          <ChatCard />
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- solo mode --------------------------------- */

const ANTI_CHARITIES = [
  { emoji: '😈', label: "Your rival club's youth academy", tag: 'ANTI-CHARITY', active: true },
  { emoji: '🍍', label: 'The pineapple-on-pizza lobby' },
  { emoji: '📢', label: 'A 4AM motivational podcast' },
  { emoji: '😇', label: 'An actual charity', tag: 'THE GENTLE OPTION' },
]

function AntiCharityCard() {
  return (
    <div className="w-full max-w-md rounded-3xl border border-line-warm bg-sand-card p-6 shadow-[0_24px_50px_-24px_rgba(62,52,30,0.3)]">
      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-warm">Solo contract — one last thing</p>
      <p className="mt-2 font-clash text-xl font-semibold text-ink-warm">
        If you fail, your €50 goes to…
      </p>

      <div className="mt-5 space-y-2.5">
        {ANTI_CHARITIES.map((o) => (
          <div
            key={o.label}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
              o.active ? 'border-loss/50 bg-loss/[0.06]' : 'border-line-warm bg-white/50'
            }`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                o.active ? 'border-loss-dark' : 'border-line-warm'
              }`}
            >
              {o.active && <span className="h-2 w-2 rounded-full bg-loss-dark" />}
            </span>
            <span className="text-base leading-none">{o.emoji}</span>
            <span className={`min-w-0 flex-1 text-sm ${o.active ? 'font-medium text-ink-warm' : 'text-muted-warm'}`}>
              {o.label}
            </span>
            {o.tag && (
              <span
                className={`hidden whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[8px] tracking-[0.12em] sm:inline ${
                  o.active ? 'border-loss/40 text-loss-dark' : 'border-line-warm text-muted-warm'
                }`}
              >
                {o.tag}
              </span>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted-warm/80">
        Locked before you start · no takebacks
      </p>

      <div className="mt-4 border-t border-dashed border-line-warm pt-3.5">
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span className="uppercase tracking-[0.15em] text-muted-warm">Ante's cut of your forfeit</span>
          <span className="font-bold text-pine">€0.00</span>
        </div>
      </div>
    </div>
  )
}

function SoloMode() {
  return (
    <section id="solo" className="border-t border-line-warm py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <div className="rise order-2 flex justify-center lg:order-1 lg:justify-start">
          <AntiCharityCard />
        </div>
        <div className="rise order-1 lg:order-2">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-pine">Solo mode</p>
          <h2 className="font-clash text-4xl font-semibold tracking-tight text-ink-warm sm:text-5xl">
            No squad? Make failure <em className="font-editorial font-normal italic text-pine">fund the enemy.</em>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-warm">
            Stake solo and pick where the money goes if you miss: a charity — or an
            anti-charity, a cause you'd hate to see a single cent of. Sleep through the 6AM
            run and your €50 buys your rival club new youth kits. Suddenly the alarm works.
          </p>
          <ul className="mt-7 space-y-3">
            {[
              'You pick the destination up front — locked, no takebacks',
              'Ante keeps €0.00 of forfeits — solo or squad, ever',
              'We only earn when you play: a small table rake + membership',
            ].map((b) => (
              <li key={b} className="flex items-start gap-2.5 font-mono text-xs leading-relaxed text-muted-warm">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pine" /> {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 max-w-md rounded-2xl border border-pine/25 bg-pine/[0.06] px-5 py-4">
            <p className="font-clash text-lg font-medium leading-snug text-pine">
              We don't profit when you fail. We'd rather you win.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- why it works ------------------------------ */

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
  return <span ref={ref} className="tabular-nums">{value}{suffix}</span>
}

const NUMBERS = [
  { label: 'Loss aversion', end: 2, suffix: '×', accent: true, text: 'Losing €50 hurts about twice as much as winning €50 feels good. Every casino runs on it — now it works for you.' },
  { label: 'With money staked', end: 90, suffix: '%+', accent: true, text: 'Follow-through reported across money-staked goal apps. Skin in the game finishes what motivation starts.' },
  { label: 'Without stakes', end: 20, suffix: '%', accent: false, text: 'Roughly where free habit trackers land. A gray square costs nothing — so it changes nothing.' },
]

const RULES = [
  { icon: Scale, title: 'You are the house', text: 'No dice, no odds, no chance. Whether you lose is decided entirely by whether you show up — which is exactly why this isn\'t gambling. 18+ anyway.' },
  { icon: ShieldCheck, title: 'Humans before charges', text: 'AI verifies, but every rejection can be appealed to a person before a cent moves. We never charge silently.' },
  { icon: Handshake, title: 'We charge the table, not the loser', text: 'A small rake on pots plus an optional membership. We make money when you play — not when you fail. We\'d rather you win.' },
]

function WhyItWorks() {
  return (
    <section id="why" className="border-t border-line-warm py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="rise max-w-2xl">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-pine">Why it works</p>
          <h2 className="font-clash text-4xl font-semibold tracking-tight text-ink-warm sm:text-5xl">
            Casino mechanics, <em className="font-editorial font-normal italic text-pine">gym outcomes.</em>
          </h2>
        </div>

        <div className="rise mt-14 grid gap-10 border-y border-line-warm py-12 sm:grid-cols-3">
          {NUMBERS.map((p) => (
            <div key={p.label}>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-warm">{p.label}</p>
              <p className={`mt-3 font-clash text-6xl font-semibold sm:text-7xl ${p.accent ? 'text-pine' : 'text-muted-warm/50'}`}>
                <CountUp end={p.end} suffix={p.suffix} />
              </p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-warm">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="rise mt-14 grid gap-10 sm:grid-cols-3">
          {RULES.map((r) => (
            <div key={r.title}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-pine/10 text-pine">
                <r.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-clash text-lg font-semibold text-ink-warm">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-warm">{r.text}</p>
            </div>
          ))}
        </div>

        <p className="rise mt-12 max-w-2xl font-mono text-[10px] leading-relaxed text-muted-warm/70">
          Loss aversion ≈ 2×: Kahneman & Tversky (1979). Completion rates as reported across money-staked goal apps — we'll publish our own after beta.
        </p>
      </div>
    </section>
  )
}

/* -------------------------------- contracts --------------------------------- */

const CONTRACTS = [
  { icon: Sunrise, title: 'The 6AM Club', proof: 'Selfie before 6:05 — metadata checked.', price: '€10/day' },
  { icon: Dumbbell, title: 'Gym 4×/week', proof: 'Geotag or it didn\'t happen.', price: '€50/week' },
  { icon: Smartphone, title: 'Screen time under 2h', proof: 'Daily screen-time screenshot.', price: '€5/fail' },
  { icon: Pizza, title: 'No delivery apps', proof: 'Bank feed says otherwise? Pay up.', price: '€25/week' },
  { icon: Timer, title: 'Deep work, 2h daily', proof: 'Focus tracker proof, every session.', price: '€15/day' },
  { icon: Footprints, title: '20 km per week', proof: 'Watch data, synced by Sunday night.', price: '€40/week' },
]

function Contracts() {
  return (
    <section id="contracts" className="border-t border-line-warm bg-sand-card/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="rise flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-pine">Starter contracts</p>
            <h2 className="font-clash text-4xl font-semibold tracking-tight text-ink-warm sm:text-5xl">
              Pick your <em className="font-editorial font-normal italic text-pine">poison.</em>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-warm">
            Six starters — or write your own contract. Any habit, any proof, any stake.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTRACTS.map((c) => (
            <a
              key={c.title}
              href="#waitlist"
              className="rise group rounded-2xl border border-line-warm bg-sand-card p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-pine/50 hover:shadow-[0_18px_36px_-18px_rgba(14,124,82,0.25)]"
            >
              <div className="flex items-start justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-pine/10 text-pine transition-transform duration-300 group-hover:scale-110">
                  <c.icon className="h-5 w-5" />
                </span>
                <span className="rounded-full border border-line-warm px-3 py-1 font-mono text-[10px] text-gold-dark">{c.price}</span>
              </div>
              <h3 className="mt-5 font-clash text-xl font-semibold text-ink-warm">{c.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-warm">{c.proof}</p>
            </a>
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
    a: 'No. Gambling needs chance. There\'s none here — whether you lose money is 100% decided by whether you do the thing you said you\'d do. You are the house. 18+, not available where prohibited.',
  },
  {
    q: 'What if I did the habit but the AI rejects my proof?',
    a: 'Every rejection can be appealed to a human before any money moves. We never charge silently, and evidence disputes resolve in your favor unless it\'s clear-cut.',
  },
  {
    q: 'How does Ante make money?',
    a: 'A small cut of squad pots and an optional membership — the way a poker room charges the table, not the loser. We make money when you play, not when you fail.',
  },
  {
    q: 'Where does the money go if I fail solo?',
    a: 'Never to us. Before you start, you pick where solo forfeits go — a charity, or better, an anti-charity: a cause you\'d hate to fund. Sleep through your 6AM run and your €50 goes to your rival football club\'s youth academy. Suddenly the alarm works. (Squad forfeits always go to your squad.)',
  },
  {
    q: 'What stops someone from faking proof?',
    a: 'Fresh-capture photo requirements, metadata checks, and AI that\'s seen every trick. Also: cheating your own gym pot is a genuinely sad thing to do to yourself.',
  },
  {
    q: 'When does it launch?',
    a: 'Solo stakes first, squad pots right after. The waitlist gets in first, in order — and the first 500 get founding pricing.',
  },
]

function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="border-t border-line-warm py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="rise text-center">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-pine">FAQ</p>
          <h2 className="font-clash text-4xl font-semibold tracking-tight text-ink-warm sm:text-5xl">
            The fine print, <em className="font-editorial font-normal italic text-pine">out loud.</em>
          </h2>
        </div>
        <div className="rise mt-14 border-t border-line-warm">
          {FAQS.map((f, i) => (
            <div key={f.q} className="border-b border-line-warm">
              <button
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
              >
                <span className="font-clash text-lg font-medium text-ink-warm">{f.q}</span>
                <Plus className={`h-5 w-5 shrink-0 text-pine transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`} />
              </button>
              <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}>
                <div className="overflow-hidden">
                  <p className="max-w-xl pb-6 text-sm leading-relaxed text-muted-warm">{f.a}</p>
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

  if (status === 'sent') {
    return (
      <div className={`flex items-center gap-3 rounded-2xl border border-pine/30 bg-pine/[0.07] px-6 ${compact ? 'py-4' : 'py-8'}`}>
        <CheckCircle2 className="h-5 w-5 shrink-0 text-pine" />
        <p className="text-sm text-ink-warm">
          <span className="font-semibold">You're in.</span>{' '}
          <span className="text-muted-warm">Founding spot secured — watch your inbox.</span>
        </p>
      </div>
    )
  }

  const inputCls =
    'w-full rounded-full border border-line-warm bg-white px-5 py-3.5 text-sm text-ink-warm placeholder:text-muted-warm/60 focus:border-pine/60 focus:outline-none focus:ring-1 focus:ring-pine/30 transition'

  if (compact) {
    return (
      <form onSubmit={onSubmit} className="flex max-w-xl flex-col gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className={inputCls}
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <select
              required
              value={pick}
              onChange={(e) => setPick(e.target.value)}
              className={`${inputCls} appearance-none pr-10 ${pick ? 'text-ink-warm' : 'text-muted-warm/60'}`}
            >
              <option value="" disabled>I'd stake money on…</option>
              {STAKE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-warm" />
          </div>
          <button
            type="submit"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-ink-warm px-6 py-3.5 text-sm font-medium text-sand transition-colors hover:bg-pine"
          >
            {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {status === 'sending' ? 'Locking…' : 'Claim early access'}
          </button>
        </div>
        {status === 'error' && (
          <p className="flex items-center gap-1.5 text-xs text-loss-dark">
            <AlertTriangle className="h-3.5 w-3.5" /> Something broke — try again.
          </p>
        )}
      </form>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-warm">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={inputCls} />
      </div>
      <div>
        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-warm">What would you put money on?</label>
        <div className="relative">
          <select
            required
            value={pick}
            onChange={(e) => setPick(e.target.value)}
            className={`${inputCls} appearance-none pr-10 ${pick ? 'text-ink-warm' : 'text-muted-warm/60'}`}
          >
            <option value="" disabled>Choose your battle</option>
            {STAKE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-warm" />
        </div>
      </div>
      {pick === 'other' && (
        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-warm">Name it</label>
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
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-warm py-4 text-sm font-medium text-sand transition-colors hover:bg-pine"
      >
        {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {status === 'sending' ? 'Locking your spot…' : 'Claim early access'}
        {status !== 'sending' && <ArrowRight className="h-4 w-4" />}
      </button>
      {status === 'error' && (
        <p className="flex items-center gap-1.5 text-xs text-loss-dark">
          <AlertTriangle className="h-3.5 w-3.5" /> Something broke — try again, or email hello@ante.app.
        </p>
      )}
      <p className="text-[11px] leading-relaxed text-muted-warm/70">No spam, no sharing — launch updates only. Unsubscribe anytime.</p>
    </form>
  )
}

function WaitlistSection() {
  return (
    <section id="waitlist" className="relative overflow-hidden border-t border-line-warm bg-sand-card/50 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(50% 45% at 20% 100%, rgba(14,124,82,0.08), transparent 65%)' }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-12">
        <div className="rise lg:col-span-6">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-pine">Waitlist open</p>
          <h2 className="font-clash text-4xl font-semibold leading-[1.05] tracking-tight text-ink-warm sm:text-6xl">
            Put your money where your{' '}
            <em className="font-editorial font-normal italic text-pine">mouth is.</em>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-muted-warm">
            Solo stakes first, squad pots right after. The waitlist gets in first, in order.
          </p>
          <div className="mt-6 w-max rounded-full border border-gold-dark/40 bg-gold/10 px-4 py-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-dark">First 500 → founding pricing</p>
          </div>
          <p className="mt-8 max-w-sm text-[11px] leading-relaxed text-muted-warm/70">
            18+. Void where prohibited. Outcomes are determined solely by your own actions — no element of chance.
            Stakes are capped. Charges only occur after evidence review, with a human appeal available.
          </p>
        </div>
        <div className="rise lg:col-span-6">
          <div className="rounded-3xl border border-line-warm bg-sand-card p-8 shadow-[0_24px_50px_-24px_rgba(62,52,30,0.3)] sm:p-10">
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
    <footer className="border-t border-line-warm pb-8 pt-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-clash text-2xl font-semibold text-ink-warm">Ante<span className="text-pine">.</span></p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-warm">
              Real money on the line. Real habits, finally. Building in public — waitlist open.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <span className="ring-pulse h-2 w-2 rounded-full bg-pine" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-warm">Waitlist open — landing v2</span>
            </div>
          </div>
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-warm">Explore</p>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-muted-warm transition-colors hover:text-ink-warm">{l.label}</a>
                </li>
              ))}
              <li>
                <a href="#waitlist" className="text-pine transition-colors hover:text-pine-dark">Get early access</a>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-warm">Legal</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/privacy" className="text-muted-warm transition-colors hover:text-ink-warm">Privacy policy</Link></li>
              <li><Link to="/terms" className="text-muted-warm transition-colors hover:text-ink-warm">Terms</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-warm">The fine print</p>
            <p className="text-[11px] leading-relaxed text-muted-warm/80">
              18+. Void where prohibited. No element of chance — outcomes depend solely on your own actions.
              Stakes are capped. Charges only after evidence review, with human appeal. Not financial advice; barely lifestyle advice.
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line-warm pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-warm/70 sm:flex-row">
          <span>© 2026 Ante (working title)</span>
          <span>Miss a habit, pay your friends.</span>
        </div>
      </div>
    </footer>
  )
}

/* ----------------------------------- root ------------------------------------ */

export default function App() {
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 300)
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    let ctx
    if (!prefersReducedMotion) {
      ctx = gsap.context(() => {
        gsap.utils.toArray('.rise').forEach((el) => {
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            y: 26,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          })
        })
      })
    }
    return () => {
      clearTimeout(id)
      window.removeEventListener('load', onLoad)
      ctx?.revert()
    }
  }, [])

  return (
    <div className="min-h-screen bg-sand font-gsans text-ink-warm">
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <HowItWorks />
        <WeekAtTheTable />
        <SoloMode />
        <WhyItWorks />
        <Contracts />
        <FAQ />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  )
}
