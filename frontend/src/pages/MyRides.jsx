
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const C = { primary:'#fb923c', dark:'#ea580c', light:'#fff7ed', surface:'#fff8f0', border:'#fed7aa', white:'#fff', text:'#1a1a1a', muted:'#888' };

export default function MyRides() {
  const nav = useNavigate();
  const [tab, setTab]   = useState('offered');
  const [data, setData] = useState({ offered:[], booked:[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/rides/my', { headers:{ Authorization:`Bearer ${token}` } })
      .then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  const updateStatus = async (rideId, status) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/rides/${rideId}/status`, { method:'PUT', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body:JSON.stringify({ status }) });
    window.location.reload();
  };

  const statusColor = { upcoming:{ bg:'#f0fdf4', color:'#16a34a' }, ongoing:{ bg:'#fff8f0', color:C.dark }, completed:{ bg:'#eff6ff', color:'#2563eb' }, cancelled:{ bg:'#fff5f5', color:'#dc2626' } };
  const tag = { background:C.light, color:C.dark, borderRadius:8, padding:'4px 10px', fontSize:12, fontWeight:600, marginRight:6, marginTop:6, display:'inline-block', border:`1px solid ${C.border}` };
  const rides = tab === 'offered' ? data.offered : data.booked;

  return (
    <div style={{ minHeight:'100vh', background:C.surface, padding:'32px 24px', color:C.text }}>
      <div style={{ maxWidth:700, margin:'0 auto' }}>
        <div style={{ marginBottom:24 }}>
          <h1 style={{ fontSize:30, fontWeight:900, color:C.text, marginBottom:6 }}>My <span style={{ color:C.dark }}>Rides</span></h1>
          <p style={{ color:C.muted }}>Track all your rides in one place</p>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:0, marginBottom:24, background:C.white, borderRadius:12, padding:4, width:'fit-content', border:`1px solid ${C.border}` }}>
          {[['offered','🚘 Offered'], ['booked','🎫 Booked']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ padding:'10px 22px', borderRadius:9, fontWeight:700, cursor:'pointer', border:'none', fontSize:14, background: tab===key ? C.primary : 'transparent', color: tab===key ? C.white : C.muted }}>
              {label} ({data[key].length})
            </button>
          ))}
        </div>

        {loading && <p style={{ color:C.muted }}>Loading rides...</p>}

        {!loading && rides.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 24px', color:C.muted, background:C.white, borderRadius:16, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:52, marginBottom:12 }}>{tab === 'offered' ? '🚘' : '🎫'}</div>
            <p style={{ marginBottom:16 }}>No {tab} rides yet.</p>
            <button onClick={() => nav(tab === 'offered' ? '/offer' : '/book')}
              style={{ background:C.primary, color:C.white, border:'none', borderRadius:10, padding:'10px 24px', fontWeight:700, cursor:'pointer', fontSize:14 }}>
              {tab === 'offered' ? 'Offer a Ride' : 'Find a Ride'}
            </button>
          </div>
        )}

        {rides.map(ride => (
          <div key={ride._id} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:20, marginBottom:12, borderLeft:`4px solid ${C.primary}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, flexWrap:'wrap' }}>
                  <span style={{ fontSize:15, color:C.text, fontWeight:600 }}>
                    <span style={{ color:'#16a34a' }}>●</span> {ride.from.name}
                    <span style={{ color:C.muted, margin:'0 8px' }}>→</span>
                    <span style={{ color:'#dc2626' }}>●</span> {ride.to.name}
                  </span>
                  <span style={{ ...statusColor[ride.status], padding:'3px 12px', borderRadius:20, fontSize:12, fontWeight:700 }}>
                    {ride.status}
                  </span>
                </div>
                <div>
                  <span style={tag}>🕐 {new Date(ride.departureTime).toLocaleString()}</span>
                  <span style={tag}>💰 ₹{ride.pricePerSeat}/seat</span>
                  <span style={tag}>💺 {ride.availableSeats} left</span>
                  <span style={tag}>👥 {ride.riders?.length || 0} riders</span>
                  {ride.co2Saved > 0 && <span style={tag}>🌱 {ride.co2Saved}kg saved</span>}
                </div>
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', flexShrink:0 }}>
                {tab === 'offered' && ride.status === 'upcoming' && (
                  <button onClick={() => updateStatus(ride._id, 'ongoing')}
                    style={{ background:C.primary, color:C.white, border:'none', borderRadius:8, padding:'8px 16px', fontWeight:700, cursor:'pointer', fontSize:13 }}>
                    Start Ride
                  </button>
                )}
                {tab === 'offered' && ride.status === 'ongoing' && (
                  <>
                    <button onClick={() => nav(`/track/${ride._id}`)}
                      style={{ background:C.primary, color:C.white, border:'none', borderRadius:8, padding:'8px 16px', fontWeight:700, cursor:'pointer', fontSize:13 }}>
                      📍 Track
                    </button>
                    <button onClick={() => updateStatus(ride._id, 'completed')}
                      style={{ background:C.white, color:C.dark, border:`1.5px solid ${C.primary}`, borderRadius:8, padding:'8px 14px', fontWeight:600, cursor:'pointer', fontSize:13 }}>
                      Complete
                    </button>
                  </>
                )}
                {tab === 'booked' && ride.status === 'ongoing' && (
                  <button onClick={() => nav(`/track/${ride._id}`)}
                    style={{ background:C.primary, color:C.white, border:'none', borderRadius:8, padding:'8px 16px', fontWeight:700, cursor:'pointer', fontSize:13 }}>
                    📍 Live Track
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
