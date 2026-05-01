import { Link } from 'react-router-dom';

const C = {
  primary:   '#fb923c',
  dark:      '#ea580c',
  light:     '#fff7ed',
  surface:   '#fff8f0',
  text:      '#1a1a1a',
  muted:     '#888',
  white:     '#fff',
  border:    '#fed7aa',
};

export default function Home() {
  const token = localStorage.getItem('token');

  return (
    <div style={{ background: C.white, minHeight: '100vh', color: C.text }}>

      {/* Hero */}
      <div style={{ background: C.light, padding: '72px 24px 60px', textAlign: 'center', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'inline-block', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 20, padding: '4px 16px', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 24 }}>
          🚀 AI-Powered Ride Sharing
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 16px', lineHeight: 1.1, color: C.text }}>
          Share Rides,<br />
          <span style={{ color: C.dark }}>Split Costs,</span><br />
          <span style={{ color: C.primary }}>Save Money.</span>
        </h1>
        <p style={{ fontSize: 18, color: C.muted, maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.6 }}>
          ShareGo uses smart AI to match you with riders going your way. Travel cheaper, safer, and greener — together.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={token ? '/book' : '/register'} style={{ background: C.primary, color: C.white, borderRadius: 12, padding: '14px 32px', textDecoration: 'none', fontWeight: 700, fontSize: 16, border: 'none' }}>
            🔍 Find a Ride
          </Link>
          <Link to={token ? '/offer' : '/register'} style={{ background: C.white, color: C.dark, borderRadius: 12, padding: '14px 32px', textDecoration: 'none', fontWeight: 700, fontSize: 16, border: `2px solid ${C.primary}` }}>
            🚘 Offer a Ride
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: C.dark, padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 56, flexWrap: 'wrap' }}>
          {[['10K+', 'Rides Shared'], ['₹50L+', 'Total Saved'], ['5T+', 'CO₂ Reduced'], ['4.8★', 'Safety Score']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: C.white }}>{n}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '64px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: C.text, marginBottom: 12 }}>
            Why Choose <span style={{ color: C.dark }}>ShareGo?</span>
          </h2>
          <p style={{ color: C.muted, fontSize: 16 }}>Everything you need for a smarter commute</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {[
            ['🤖', 'AI Smart Matching',    'Our AI finds rides going exactly your way using GPS — no manual searching.'],
            ['💰', 'Fair Fare Splitting',  'Pay only for your portion. AI splits costs based on your exact distance.'],
            ['🛡️', 'Safety Score System', 'Every driver has a score based on reviews. Ride only with trusted people.'],
            ['👩', 'Women-Only Rides',    'Female riders can filter rides with female drivers for extra comfort.'],
            ['🌱', 'CO₂ Tracker',         'See exactly how much carbon you have saved by sharing rides.'],
            ['📍', 'Live GPS Tracking',   'Track your ride in real-time. Share location with family for safety.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, borderTop: `3px solid ${C.primary}` }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: C.text }}>{title}</div>
              <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: C.light, padding: '64px 24px', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 900, marginBottom: 48, color: C.text }}>
          How It <span style={{ color: C.dark }}>Works</span>
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', maxWidth: 900, margin: '0 auto' }}>
          {[
            ['1', 'Create Account', 'Sign up in 30 seconds'],
            ['2', 'Enter Your Route', 'Tell us where you are going'],
            ['3', 'AI Finds Matches', 'We match you instantly'],
            ['4', 'Share & Save', 'Travel together, pay less'],
          ].map(([num, title, desc]) => (
            <div key={num} style={{ textAlign: 'center', maxWidth: 180 }}>
              <div style={{ background: C.primary, color: C.white, borderRadius: '50%', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 22, margin: '0 auto 16px' }}>{num}</div>
              <div style={{ fontWeight: 700, marginBottom: 6, color: C.text, fontSize: 15 }}>{title}</div>
              <div style={{ color: C.muted, fontSize: 13 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '64px 24px', textAlign: 'center', background: C.white }}>
        <h2 style={{ fontSize: 38, fontWeight: 900, marginBottom: 14, color: C.text }}>
          Ready to <span style={{ color: C.dark }}>ShareGo?</span>
        </h2>
        <p style={{ color: C.muted, marginBottom: 32, fontSize: 16 }}>Join thousands of smart commuters saving money every day.</p>
        <Link to={token ? '/book' : '/register'} style={{ background: C.primary, color: C.white, borderRadius: 12, padding: '16px 40px', textDecoration: 'none', fontWeight: 700, fontSize: 17 }}>
          Get Started — It's Free 🚀
        </Link>
      </div>
    </div>
  );
}