import LegalPage from './LegalPage.jsx'

const SECTIONS = [
  {
    h: 'What we collect',
    p: 'If you join the waitlist we store your email address, your answer to "what would you put money on", and basic attribution data (which link brought you here). Nothing else — no tracking pixels, no ad identifiers.',
  },
  {
    h: 'What we do with it',
    p: 'We email you about the Ante launch and early access. We do not sell, rent, or share your data with anyone. You can unsubscribe with one click and we delete your entry on request.',
  },
  {
    h: 'Where it lives',
    p: 'Waitlist entries are stored in our own systems and processed only to run the waitlist. When the app launches, a full privacy policy covering payments, proof media, and verification data will replace this one.',
  },
  {
    h: 'Contact',
    p: 'Questions or deletion requests: reply to any waitlist email and we\'ll handle it. A permanent contact address arrives with our domain.',
  },
]

export default function PrivacyPolicy() {
  return <LegalPage title="Privacy policy" updated="July 2026" sections={SECTIONS} />
}
