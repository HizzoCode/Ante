import LegalPage from './LegalPage.jsx'

const SECTIONS = [
  {
    h: 'What this is',
    p: 'This site is a pre-launch waitlist for Ante, a habit accountability product where users voluntarily stake their own money on completing self-chosen goals. Joining the waitlist costs nothing and commits you to nothing.',
  },
  {
    h: 'Not gambling',
    p: 'Ante contracts contain no element of chance. Whether a stake is kept or forfeited is determined solely by the user’s own documented actions. Ante will be available to users 18 and older, and void where prohibited by local law.',
  },
  {
    h: 'No promises yet',
    p: 'Features, pricing, stake mechanics, and launch dates described on this page are pre-launch plans and may change. Founding pricing applies to the first 500 waitlist signups at launch.',
  },
  {
    h: 'Contact',
    p: 'Questions: hello@ante.app.',
  },
]

export default function Terms() {
  return <LegalPage title="Terms" updated="July 2026" sections={SECTIONS} />
}
