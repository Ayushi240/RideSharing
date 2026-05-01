import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const C = { primary:'#fb923c', dark:'#ea580c', light:'#fff7ed', surface:'#fff8f0', border:'#fed7aa', white:'#fff', text:'#1a1a1a', muted:'#888' };

export default function OfferRide() {
  const nav = useNavigate();
  const [form, setForm] = useState({ fromName:'', fromLat:'', fromLng:'', toName:'', toLat:'', toLng:'', departureTime:'', totalSeats:3, distanceKm:10, womenOnly:false });
  const [msg, setMsg]   = useState('');
  const [loading, setLoading] = useState(false);
  const f = k => e => setForm({...form, [k]:e.target.value});

  const estPrice = Math.round(20 + (parseFloat(form.distanceKm) || 0) * 8);
  const co2Saved = parseFloat((0.21 * (parseFloat(form.distanceKm) || 0) * ((parseInt(form.totalSeats) || 1) - 1)).toFixed(2));

  const input  = { width:'100%', background:C.white, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'11px 14px', color:C.text, fontSize:14, outline:'none', boxSizing:'border-box' };
  const label  = { display:'block', color:'#555', fontSize:13, fontWeight:600, marginBottom:6, marginTop:14 };

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setMsg('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/rides/offer', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({
          from:{ name:form.fromName, coordinates:{ lat:parseFloat(form.fromLat), lng:parseFloat(form.fromLng) } },
          to:  { name:form.toName,   coordinates:{ lat:parseFloat(form.toLat),   lng:parseFloat(form.toLng)   } },
          departureTime:form.departureTime, totalSeats:parseInt(form.totalSeats),
          distanceKm:parseFloat(form.distanceKm), womenOnly:form.womenOnly
        })
      });
      const data = await res.json();
      if (!res.ok) { setMsg(`❌ ${data.msg}`); return; }
      setMsg('🎉 Ride offered successfully! Riders can now find you.');
      setTimeout(() => nav('/my-rides'), 2000);
    } catch { setMsg('❌ Connection error.'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:C.surface, padding:'32px 24px', color:C.text }}>
      <div style={{ maxWidth:600, margin:'0 auto' }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:30, fontWeight:900, color:C.text, marginBottom:6 }}>
            Offer a <span style={{ color:C.dark }}>Ride</span>
          </h1>
          <p style={{ color:C.muted, fontSize:15 }}>Share your journey and split costs with others</p>
        </div>

        {msg && (
          <div style={{ background: msg.startsWith('🎉') ? '#f0fdf4' : '#fff8f0', border:`1px solid ${msg.startsWith('🎉') ? '#86efac' : C.border}`, borderRadius:10, padding:'12px 16px', marginBottom:16, color: msg.startsWith('🎉') ? '#16a34a' : C.dark, fontSize:14 }}>
            {msg}
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:18, padding:24, marginBottom:16, boxShadow:'0 2px 16px rgba(251,146,60,0.06)' }}>
            <h3 style={{ color:C.dark, margin:'0 0 4px', fontSize:16, fontWeight:700 }}>📍 Route Details</h3>
            <p style={{ color:C.muted, fontSize:13, marginBottom:4 }}>Enter pickup and drop coordinates</p>

            <label style={label}>From (Area Name)</label>
            <input required style={input} placeholder="e.g. Tambaram" value={form.fromName} onChange={f('fromName')} />
            <div style={{ display:'flex', gap:8, marginTop:8 }}>
              <input required style={input} placeholder="From Latitude"  value={form.fromLat} onChange={f('fromLat')} />
              <input required style={input} placeholder="From Longitude" value={form.fromLng} onChange={f('fromLng')} />
            </div>

            <label style={label}>To (Area Name)</label>
            <input required style={input} placeholder="e.g. Anna Nagar" value={form.toName} onChange={f('toName')} />
            <div style={{ display:'flex', gap:8, marginTop:8 }}>
              <input required style={input} placeholder="To Latitude"  value={form.toLat} onChange={f('toLat')} />
              <input required style={input} placeholder="To Longitude" value={form.toLng} onChange={f('toLng')} />
            </div>

            <label style={label}>Departure Time</label>
            <input required type="datetime-local" style={input} onChange={f('departureTime')} />

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:14 }}>
              <div>
                <label style={{ ...label, marginTop:0 }}>Available Seats</label>
                <input type="number" min="1" max="6" value={form.totalSeats} style={input} onChange={f('totalSeats')} />
              </div>
              <div>
                <label style={{ ...label, marginTop:0 }}>Distance (km)</label>
                <input type="number" min="1" value={form.distanceKm} style={input} onChange={f('distanceKm')} />
              </div>
            </div>

            <label style={{ ...label, display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
              <input type="checkbox" checked={form.womenOnly} onChange={e => setForm({...form, womenOnly:e.target.checked})} style={{ accentColor:C.primary, width:16, height:16 }} />
              👩 Women-only ride
            </label>
          </div>

          {/* Live Preview */}
          <div style={{ background:C.light, border:`1px solid ${C.border}`, borderRadius:16, padding:20, marginBottom:16 }}>
            <div style={{ color:C.dark, fontWeight:700, marginBottom:14, fontSize:15 }}>💡 Ride Preview</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                ['💰 Price per seat', `₹${estPrice}`],
                ['🌱 CO₂ saved',      `~${co2Saved} kg`],
                ['💺 Seats offered',  form.totalSeats],
                ['📏 Distance',       `${form.distanceKm} km`],
              ].map(([lbl, val]) => (
                <div key={lbl} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:12 }}>
                  <div style={{ color:C.muted, fontSize:12, marginBottom:2 }}>{lbl}</div>
                  <div style={{ color:C.text, fontWeight:700, fontSize:18 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width:'100%', background:C.primary, color:C.white, border:'none', borderRadius:12, padding:14, fontSize:16, fontWeight:700, cursor:'pointer' }}>
            {loading ? 'Posting Ride...' : '🚘 Post My Ride'}
          </button>
        </form>
      </div>
    </div>
  );
}