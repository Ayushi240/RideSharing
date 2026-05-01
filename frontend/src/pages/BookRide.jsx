import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const C = { primary:'#fb923c', dark:'#ea580c', light:'#fff7ed', surface:'#fff8f0', border:'#fed7aa', white:'#fff', text:'#1a1a1a', muted:'#888' };

export default function BookRide() {
  const nav = useNavigate();
  const [form, setForm]   = useState({ fromName:'', fromLat:'', fromLng:'', toName:'', toLat:'', toLng:'', womenOnly:false });
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]     = useState('');
  const [searched, setSearched] = useState(false);
  const f = k => e => setForm({...form, [k]:e.target.value});

  const input = { width:'100%', background:C.white, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'11px 14px', color:C.text, fontSize:14, outline:'none', boxSizing:'border-box' };
  const card  = { background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:20, marginBottom:12, borderLeft:`4px solid ${C.primary}` };
  const tag   = { background:C.light, color:C.dark, borderRadius:8, padding:'4px 10px', fontSize:12, fontWeight:600, marginRight:8, marginTop:6, display:'inline-block', border:`1px solid ${C.border}` };

  const search = async () => {
    if (!form.fromLat || !form.fromLng || !form.toLat || !form.toLng) { setMsg('⚠️ Please enter coordinates.'); return; }
    setLoading(true); setMsg(''); setSearched(true);
    try {
      const res = await fetch('/api/rides/match', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ from:{ lat:parseFloat(form.fromLat), lng:parseFloat(form.fromLng) }, to:{ lat:parseFloat(form.toLat), lng:parseFloat(form.toLng) }, womenOnly:form.womenOnly })
      });
      const data = await res.json();
      setRides(data);
      if (data.length === 0) setMsg('No rides found nearby. Try different coordinates.');
    } catch { setMsg('❌ Connection error.'); }
    setLoading(false);
  };

  const book = async (rideId) => {
    const token = localStorage.getItem('token');
    try {
      const res  = await fetch(`/api/rides/book/${rideId}`, { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body:JSON.stringify({ riderDistance:10 }) });
      const data = await res.json();
      if (!res.ok) { setMsg(`❌ ${data.msg}`); return; }
      setMsg(`✅ Booked! Your fare: ₹${data.fare}`);
      setTimeout(() => nav('/my-rides'), 1500);
    } catch { setMsg('❌ Booking failed.'); }
  };

  return (
    <div style={{ minHeight:'100vh', background:C.surface, padding:'32px 24px', color:C.text }}>
      <div style={{ maxWidth:700, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:30, fontWeight:900, color:C.text, marginBottom:6 }}>
            Find a <span style={{ color:C.dark }}>Shared Ride</span>
          </h1>
          <p style={{ color:C.muted, fontSize:15 }}>AI matches you with riders going your way</p>
        </div>

        {/* Search Form */}
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:18, padding:24, marginBottom:20, boxShadow:'0 2px 16px rgba(251,146,60,0.06)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            <div>
              <label style={{ display:'block', color:'#555', fontSize:13, fontWeight:600, marginBottom:6 }}>📍 From</label>
              <input style={{ ...input, marginBottom:8 }} placeholder="Area name" value={form.fromName} onChange={f('fromName')} />
              <div style={{ display:'flex', gap:8 }}>
                <input style={input} placeholder="Latitude"  value={form.fromLat} onChange={f('fromLat')} />
                <input style={input} placeholder="Longitude" value={form.fromLng} onChange={f('fromLng')} />
              </div>
            </div>
            <div>
              <label style={{ display:'block', color:'#555', fontSize:13, fontWeight:600, marginBottom:6 }}>🏁 To</label>
              <input style={{ ...input, marginBottom:8 }} placeholder="Area name" value={form.toName} onChange={f('toName')} />
              <div style={{ display:'flex', gap:8 }}>
                <input style={input} placeholder="Latitude"  value={form.toLat} onChange={f('toLat')} />
                <input style={input} placeholder="Longitude" value={form.toLng} onChange={f('toLng')} />
              </div>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', color:'#555', fontSize:14 }}>
              <input type="checkbox" checked={form.womenOnly} onChange={e => setForm({...form, womenOnly:e.target.checked})} style={{ accentColor:C.primary, width:16, height:16 }} />
              👩 Women-only rides only
            </label>
            <button onClick={search} disabled={loading}
              style={{ background:C.primary, color:C.white, border:'none', borderRadius:10, padding:'12px 28px', fontWeight:700, fontSize:15, cursor:'pointer' }}>
              {loading ? '🔍 Searching...' : '🤖 AI Match Rides'}
            </button>
          </div>
          <p style={{ color:C.muted, fontSize:12, marginTop:10 }}>Tip: Use Google Maps to find lat/lng of your location</p>
        </div>

        {/* Message */}
        {msg && (
          <div style={{ background: msg.startsWith('✅') ? '#f0fdf4' : '#fff8f0', border:`1px solid ${msg.startsWith('✅') ? '#86efac' : C.border}`, borderRadius:10, padding:'12px 16px', marginBottom:16, color: msg.startsWith('✅') ? '#16a34a' : C.dark, fontSize:14 }}>
            {msg}
          </div>
        )}

        {/* Results */}
        {searched && !loading && rides.length > 0 && (
          <p style={{ color:C.muted, fontSize:13, marginBottom:12 }}>✅ {rides.length} rides found — sorted by safety score</p>
        )}

        {rides.map(ride => (
          <div key={ride._id} style={card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                  <div style={{ background:C.primary, color:C.white, borderRadius:'50%', width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16, flexShrink:0 }}>
                    {ride.driver?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight:700, color:C.text }}>{ride.driver?.name}</div>
                    <div style={{ fontSize:12, color:C.dark }}>⭐ {ride.driver?.safetyScore}/5 safety score</div>
                  </div>
                  {ride.womenOnly && <span style={{ background:'#fdf2f8', color:'#9d174d', border:'1px solid #f9a8d4', borderRadius:20, padding:'2px 10px', fontSize:11, fontWeight:600 }}>👩 Women Only</span>}
                </div>
                <div style={{ fontSize:14, color:'#444', marginBottom:8 }}>
                  <span style={{ color:'#16a34a' }}>●</span> {ride.from.name}
                  <span style={{ color:C.muted, margin:'0 8px' }}>→</span>
                  <span style={{ color:'#dc2626' }}>●</span> {ride.to.name}
                </div>
                <div>
                  <span style={tag}>🕐 {new Date(ride.departureTime).toLocaleString()}</span>
                  <span style={tag}>💺 {ride.availableSeats} seats left</span>
                  <span style={tag}>📏 {ride.distanceKm} km</span>
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontSize:30, fontWeight:900, color:C.dark }}>₹{ride.pricePerSeat}</div>
                <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>per seat</div>
                <button onClick={() => book(ride._id)}
                  style={{ background:C.primary, color:C.white, border:'none', borderRadius:8, padding:'9px 18px', fontWeight:700, cursor:'pointer', fontSize:13, display:'block', width:'100%', marginBottom:6 }}>
                  Book Seat
                </button>
                <button onClick={() => nav(`/ride/${ride._id}`)}
                  style={{ background:C.light, color:C.dark, border:`1px solid ${C.border}`, borderRadius:8, padding:'7px 14px', fontWeight:600, cursor:'pointer', fontSize:12, width:'100%' }}>
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}

        {searched && !loading && rides.length === 0 && !msg && (
          <div style={{ textAlign:'center', padding:'48px 24px', color:C.muted }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
            <p>No rides found. Try different coordinates or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}