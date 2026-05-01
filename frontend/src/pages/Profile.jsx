import { useState, useEffect } from 'react';

const C = {
  primary: '#fb923c',
  dark:    '#ea580c',
  light:   '#fff7ed',
  surface: '#fff8f0',
  border:  '#fed7aa',
  white:   '#fff',
  text:    '#1a1a1a',
  muted:   '#888',
};

export default function Profile() {
  const [user, setUser]       = useState(null);
  const [form, setForm]       = useState({});
  const [editing, setEditing] = useState(false);
  const [msg, setMsg]         = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/auth/me', { headers:{ Authorization:`Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setUser(d); setForm(d); });
  }, []);

  const save = async () => {
    const token = localStorage.getItem('token');
    const res  = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setUser(data); setEditing(false);
    setMsg('✅ Profile updated!');
    setTimeout(() => setMsg(''), 2000);
  };

  const input   = { width:'100%', background:C.white, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'10px 12px', color:C.text, fontSize:14, outline:'none', boxSizing:'border-box', marginBottom:12 };
  const divider = { padding:'10px 0', borderBottom:`1px solid ${C.border}`, color:C.text, marginBottom:4 };
  const card    = { background:C.white, border:`1px solid ${C.border}`, borderRadius:18, padding:24, marginBottom:16, boxShadow:'0 2px 12px rgba(251,146,60,0.06)' };

  if (!user) return (
    <div style={{ minHeight:'100vh', background:C.surface, display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>
      Loading profile...
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:C.surface, padding:'32px 24px', color:C.text }}>
      <div style={{ maxWidth:600, margin:'0 auto' }}>

        {/* Success Message */}
        {msg && (
          <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:10, padding:'10px 16px', marginBottom:16, color:'#16a34a', fontSize:14 }}>
            {msg}
          </div>
        )}

        {/* Avatar Card */}
        <div style={{ ...card, textAlign:'center', borderTop:`4px solid ${C.primary}` }}>
          <div style={{ background:C.primary, color:C.white, borderRadius:'50%', width:72, height:72, display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, fontWeight:900, margin:'0 auto 14px' }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:C.text }}>{user.name}</div>
          <div style={{ color:C.muted, fontSize:14, marginTop:4 }}>{user.email}</div>
          <div style={{ color:C.dark, marginTop:6, fontSize:15, fontWeight:600 }}>⭐ {user.safetyScore}/5 Safety Score</div>
          {user.isVerified && (
            <div style={{ color:'#16a34a', fontSize:13, marginTop:4 }}>✅ Verified User</div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:16 }}>
          {[
            ['🚗', user.totalRides  || 0,        'Total Rides'],
            ['💰', `₹${user.totalSaved || 0}`,   'Money Saved'],
            ['🌱', `${user.co2Saved  || 0}kg`,   'CO₂ Saved'],
          ].map(([icon, val, lbl]) => (
            <div key={lbl} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:16, textAlign:'center' }}>
              <div style={{ fontSize:24 }}>{icon}</div>
              <div style={{ fontSize:20, fontWeight:800, color:C.dark, marginTop:4 }}>{val}</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Profile Info */}
        <div style={card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3 style={{ margin:0, color:C.dark, fontSize:16, fontWeight:700 }}>👤 Profile Info</h3>
            {!editing
              ? <button onClick={() => setEditing(true)}
                  style={{ background:C.light, color:C.dark, border:`1px solid ${C.border}`, borderRadius:8, padding:'7px 16px', fontWeight:600, cursor:'pointer' }}>
                  Edit
                </button>
              : <div style={{ display:'flex', gap:8 }}>
                  <button onClick={save}
                    style={{ background:C.primary, color:C.white, border:'none', borderRadius:8, padding:'8px 16px', fontWeight:700, cursor:'pointer' }}>
                    Save
                  </button>
                  <button onClick={() => { setEditing(false); setForm(user); }}
                    style={{ background:C.light, color:C.dark, border:`1px solid ${C.border}`, borderRadius:8, padding:'8px 14px', fontWeight:600, cursor:'pointer' }}>
                    Cancel
                  </button>
                </div>
            }
          </div>
          {[['Full Name','name'], ['Phone','phone']].map(([label, key]) => (
            <div key={key}>
              <div style={{ color:C.muted, fontSize:13, marginBottom:4 }}>{label}</div>
              {editing
                ? <input value={form[key] || ''} style={input}
                    onChange={e => setForm({...form, [key]:e.target.value})} />
                : <div style={divider}>{user[key] || '—'}</div>
              }
            </div>
          ))}
        </div>

        {/* Vehicle Details */}
        <div style={card}>
          <h3 style={{ color:C.dark, margin:'0 0 16px', fontSize:16, fontWeight:700 }}>🚗 Vehicle Details</h3>
          {[
            ['Vehicle Model',  'model'],
            ['Plate Number',   'plateNumber'],
            ['Vehicle Color',  'color'],
          ].map(([label, field]) => (
            <div key={field}>
              <div style={{ color:C.muted, fontSize:13, marginBottom:4 }}>{label}</div>
              {editing
                ? <input
                    value={(form.vehicleDetails && form.vehicleDetails[field]) || ''}
                    style={input}
                    onChange={e => setForm({
                      ...form,
                      vehicleDetails: { ...form.vehicleDetails, [field]: e.target.value }
                    })}
                  />
                : <div style={divider}>
                    {(user.vehicleDetails && user.vehicleDetails[field]) || '—'}
                  </div>
              }
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}