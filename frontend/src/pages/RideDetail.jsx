
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const C = { primary:'#fb923c', dark:'#ea580c', light:'#fff7ed', surface:'#fff8f0', border:'#fed7aa', white:'#fff', text:'#1a1a1a', muted:'#888' };

export default function RideDetail() {
  const { id } = useParams();
  const nav    = useNavigate();
  const [ride, setRide]   = useState(null);
  const [split, setSplit] = useState(null);
  const [msg, setMsg]     = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`/api/rides/${id}`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r => r.json()).then(setRide);
    fetch(`/api/bookings/fare-split/${id}`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r => r.json()).then(setSplit);
  }, [id]);

  const book = async () => {
    const token = localStorage.getItem('token');
    const res  = await fetch(`/api/rides/book/${id}`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
      body: JSON.stringify({ riderDistance: ride?.distanceKm })
    });
    const data = await res.json();
    if (!res.ok) { setMsg(`❌ ${data.msg}`); return; }
    setMsg(`✅ Booked! Your fare: ₹${data.fare}`);
    setTimeout(() => nav('/my-rides'), 1500);
  };

  const card = { background:C.white, border:`1px solid ${C.border}`, borderRadius:18, padding:24, marginBottom:16, boxShadow:'0 2px 12px rgba(251,146,60,0.06)' };
  const tag  = { background:C.light, color:C.dark, borderRadius:8, padding:'5px 12px', fontSize:13, fontWeight:600, display:'inline-block', marginRight:8, marginBottom:8, border:`1px solid ${C.border}` };

  if (!ride) return (
    <div style={{ minHeight:'100vh', background:C.surface, display:'flex', alignItems:'center', justifyContent:'center', color:C.muted, fontSize:16 }}>
      Loading ride details...
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:C.surface, padding:'32px 24px', color:C.text }}>
      <div style={{ maxWidth:650, margin:'0 auto' }}>

        {/* Back Button */}
        <button onClick={() => nav(-1)}
          style={{ background:C.white, border:`1px solid ${C.border}`, color:C.dark, borderRadius:10, padding:'9px 18px', cursor:'pointer', marginBottom:24, fontWeight:600, fontSize:14, display:'flex', alignItems:'center', gap:6 }}>
          ← Back
        </button>

        {/* Message */}
        {msg && (
          <div style={{ background: msg.startsWith('✅') ? '#f0fdf4' : '#fff8f0', border:`1px solid ${msg.startsWith('✅') ? '#86efac' : C.border}`, borderRadius:10, padding:'12px 16px', marginBottom:16, color: msg.startsWith('✅') ? '#16a34a' : C.dark, fontSize:14 }}>
            {msg}
          </div>
        )}

        {/* Route Card */}
        <div style={{ ...card, borderTop:`4px solid ${C.primary}` }}>
          <h2 style={{ marginTop:0, color:C.dark, fontSize:18, fontWeight:700, marginBottom:14 }}>🗺️ Route</h2>
          <div style={{ fontSize:18, fontWeight:700, marginBottom:14 }}>
            <span style={{ color:'#16a34a' }}>● {ride.from.name}</span>
            <span style={{ color:C.muted, margin:'0 12px', fontSize:16 }}>→</span>
            <span style={{ color:'#dc2626' }}>● {ride.to.name}</span>
          </div>
          <div>
            <span style={tag}>📏 {ride.distanceKm} km</span>
            <span style={tag}>🕐 {new Date(ride.departureTime).toLocaleString()}</span>
            <span style={tag}>💺 {ride.availableSeats} seats left</span>
            {ride.womenOnly && (
              <span style={{ ...tag, background:'#fdf2f8', color:'#9d174d', border:'1px solid #f9a8d4' }}>👩 Women Only</span>
            )}
          </div>
        </div>

        {/* Driver Card */}
        <div style={card}>
          <h2 style={{ marginTop:0, color:C.dark, fontSize:18, fontWeight:700, marginBottom:16 }}>👤 Driver</h2>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ background:C.primary, color:C.white, borderRadius:'50%', width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:900, flexShrink:0 }}>
              {ride.driver?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:18, color:C.text }}>{ride.driver?.name}</div>
              <div style={{ color:C.dark, fontWeight:600, fontSize:14 }}>⭐ {ride.driver?.safetyScore}/5 Safety Score</div>
              {ride.driver?.vehicleDetails?.model && (
                <div style={{ color:C.muted, fontSize:13, marginTop:4 }}>
                  🚗 {ride.driver.vehicleDetails.model}
                  {ride.driver.vehicleDetails.color && ` · ${ride.driver.vehicleDetails.color}`}
                </div>
              )}
              {ride.driver?.phone && (
                <div style={{ color:C.muted, fontSize:13, marginTop:2 }}>📞 {ride.driver.phone}</div>
              )}
            </div>
          </div>
        </div>

        {/* Riders */}
        {ride.riders?.length > 0 && (
          <div style={card}>
            <h2 style={{ marginTop:0, color:C.dark, fontSize:18, fontWeight:700, marginBottom:14 }}>👥 Riders ({ride.riders.length})</h2>
            {ride.riders.map((r, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ background:C.light, color:C.dark, borderRadius:'50%', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13 }}>
                    {r.user?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span style={{ color:C.text, fontWeight:500 }}>{r.user?.name || 'Rider'}</span>
                </div>
                <span style={{ background:'#f0fdf4', color:'#16a34a', borderRadius:8, padding:'3px 10px', fontSize:12, fontWeight:600 }}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Fare Split */}
        {split && split.splits?.length > 0 && (
          <div style={card}>
            <h2 style={{ marginTop:0, color:C.dark, fontSize:18, fontWeight:700, marginBottom:14 }}>💰 Fare Split</h2>
            <p style={{ color:C.muted, fontSize:13, marginBottom:12 }}>Each rider pays based on their travel distance</p>
            {split.splits.map((s, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <span style={{ color:C.text, fontWeight:500 }}>👤 {s.name}</span>
                  <span style={{ color:C.muted, fontSize:12, marginLeft:8 }}>{s.distance} km</span>
                </div>
                <span style={{ fontWeight:700, color:C.dark, fontSize:16 }}>₹{s.fare}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price + Book */}
        <div style={{ ...card, borderTop:`4px solid ${C.primary}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <div style={{ color:C.muted, fontSize:14 }}>Price per seat</div>
              <div style={{ fontSize:40, fontWeight:900, color:C.dark, lineHeight:1.1 }}>₹{ride.pricePerSeat}</div>
              <div style={{ color:C.muted, fontSize:13, marginTop:4 }}>Base ₹20 + ₹8/km</div>
            </div>
            <div style={{ textAlign:'right', background:C.light, border:`1px solid ${C.border}`, borderRadius:14, padding:'14px 20px' }}>
              <div style={{ color:'#16a34a', fontSize:13, fontWeight:600 }}>🌱 CO₂ Saved</div>
              <div style={{ fontSize:26, fontWeight:800, color:'#16a34a', marginTop:4 }}>{ride.co2Saved || 0} kg</div>
            </div>
          </div>
          <button onClick={book}
            style={{ width:'100%', background:C.primary, color:C.white, border:'none', borderRadius:12, padding:14, fontSize:16, fontWeight:700, cursor:'pointer' }}>
            Book This Ride 🚗
          </button>
        </div>

      </div>
    </div>
  );
}