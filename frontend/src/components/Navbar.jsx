import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const nav      = useNavigate();
  const location = useLocation();
  const token    = localStorage.getItem('token');
  const user     = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => { localStorage.clear(); nav('/login'); };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ background: '#fff', borderBottom: '2px solid #fb923c', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 60, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(251,146,60,0.1)' }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ background: '#fb923c', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🚗</div>
        <span style={{ fontWeight: 900, fontSize: 22, color: '#ea580c', letterSpacing: -0.5 }}>Share</span>
        <span style={{ fontWeight: 900, fontSize: 22, color: '#1a1a1a' }}>Go</span>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {token ? (
          <>
            {[['Find Ride', '/book'], ['Offer Ride', '/offer'], ['My Rides', '/my-rides']].map(([label, path]) => (
              <Link key={path} to={path} style={{
                textDecoration: 'none', fontWeight: 600, fontSize: 14, padding: '6px 14px', borderRadius: 8,
                background: isActive(path) ? '#fff7ed' : 'transparent',
                color: isActive(path) ? '#ea580c' : '#555',
                border: isActive(path) ? '1px solid #fb923c' : '1px solid transparent',
              }}>{label}</Link>
            ))}
            <Link to="/profile" style={{ marginLeft: 4, textDecoration: 'none' }}>
              <div style={{ background: '#fb923c', color: '#fff', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                {user.name ? user.name[0].toUpperCase() : '?'}
              </div>
            </Link>
            <button onClick={logout} style={{ marginLeft: 4, background: 'transparent', border: '1.5px solid #fb923c', color: '#ea580c', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#555', textDecoration: 'none', fontWeight: 600, fontSize: 14, padding: '6px 14px' }}>Login</Link>
            <Link to="/register" style={{ background: '#fb923c', color: '#fff', borderRadius: 8, padding: '8px 20px', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}