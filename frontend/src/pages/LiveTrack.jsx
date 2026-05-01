import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

const C = { primary:'#fb923c', dark:'#ea580c', light:'#fff7ed', surface:'#fff8f0', border:'#fed7aa', white:'#fff', text:'#1a1a1a', muted:'#888' };

export default function LiveTrack() {
  const { id }  = useParams();
  const wsRef   = useRef(null);
  const [location, setLocation] = useState(null);
  const [sharing, setSharing]   = useState(false);
  const [status, setStatus]     = useState('Connecting...');
  const [log, setLog]           = useState([]);
  const watchIdRef = useRef(null);

  const addLog = (msg) => setLog(p => [`${new Date().toLocaleTimeString()} — ${msg}`, ...p.slice(0, 9)]);

  useEffect(() => {
    wsRef.current = new WebSocket(process.env.REACT_APP_WS_URL)

    wsRef.current.onopen = () => {
      setStatus('Connected');
      wsRef.current.send(JSON.stringify({ type:'join-ride', rideId:id }));
      addLog('Joined ride tracking room');
    };
    wsRef.current.onmessage = (e) => {
      const { lat, lng } = JSON.parse(e.data);
      setLocation({ lat, lng });
      addLog(`📍 Location update received`);
    };
    wsRef.current.onerror = () => setStatus('Connection Error');
    wsRef.current.onclose = () => setStatus('Disconnected');

    return () => {
      wsRef.current?.close();
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [id]);

  const startSharing = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported on this device'); return; }
    setSharing(true);
    addLog('Started sharing your location');
    const wid = navigator.geolocation.watchPosition(
      ({ coords }) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type:'send-location', rideId:id,
            lat:coords.latitude, lng:coords.longitude
          }));
        }
      },
      (err) => addLog(`GPS error: ${err.message}`),
      { enableHighAccuracy:true, maximumAge:5000 }
    );
    watchIdRef.current = wid;
  };

  const stopSharing = () => {
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
    setSharing(false);
    addLog('Stopped sharing location');
  };

  const isConnected = status === 'Connected';
  const card = { background:C.white, border:`1px solid ${C.border}`, borderRadius:18, padding:24, marginBottom:16, boxShadow:'0 2px 12px rgba(251,146,60,0.06)' };

  return (
    <div style={{ minHeight:'100vh', background:C.surface, padding:'32px 24px', color:C.text }}>
      <div style={{ maxWidth:580, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:30, fontWeight:900, color:C.text, marginBottom:6 }}>
            📍 Live <span style={{ color:C.dark }}>Tracking</span>
          </h1>
          <p style={{ color:C.muted, fontSize:15 }}>Real-time GPS tracking for your ride</p>
        </div>

        {/* Status Bar */}
        <div style={{ ...card, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px' }}>
          <div>
            <div style={{ fontWeight:700, color:C.text, fontSize:15 }}>Connection Status</div>
            <div style={{ color:C.muted, fontSize:13, marginTop:2 }}>Ride ID: {id?.slice(-8)}...</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, background: isConnected ? '#f0fdf4' : '#fff8f0', border:`1px solid ${isConnected ? '#86efac' : C.border}`, borderRadius:20, padding:'6px 14px' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background: isConnected ? '#16a34a' : C.muted }} />
            <span style={{ fontWeight:600, fontSize:13, color: isConnected ? '#16a34a' : C.muted }}>{status}</span>
          </div>
        </div>

        {/* Location Display */}
        <div style={card}>
          <h3 style={{ color:C.dark, margin:'0 0 16px', fontSize:16, fontWeight:700 }}>🗺️ Driver Location</h3>
          {location ? (
            <div style={{ background:C.light, border:`1px solid ${C.border}`, borderRadius:14, padding:24, textAlign:'center' }}>
              <div style={{ fontSize:52, marginBottom:10 }}>📍</div>
              <div style={{ fontWeight:700, fontSize:18, color:C.dark, marginBottom:8 }}>Live Location</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, maxWidth:260, margin:'0 auto' }}>
                <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:10 }}>
                  <div style={{ color:C.muted, fontSize:11, marginBottom:2 }}>LATITUDE</div>
                  <div style={{ fontWeight:700, color:C.text, fontSize:14 }}>{location.lat.toFixed(6)}</div>
                </div>
                <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:10 }}>
                  <div style={{ color:C.muted, fontSize:11, marginBottom:2 }}>LONGITUDE</div>
                  <div style={{ fontWeight:700, color:C.text, fontSize:14 }}>{location.lng.toFixed(6)}</div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginTop:12, color:'#16a34a', fontWeight:600, fontSize:13 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#16a34a', animation:'pulse 1s infinite' }} />
                Updating live every 5 seconds
              </div>
            </div>
          ) : (
            <div style={{ background:C.light, border:`1px solid ${C.border}`, borderRadius:14, padding:40, textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>⏳</div>
              <div style={{ color:C.muted, fontSize:15 }}>Waiting for driver location...</div>
              <div style={{ color:C.muted, fontSize:13, marginTop:6 }}>The driver needs to start sharing their location</div>
            </div>
          )}
        </div>

        {/* Share Location */}
        <div style={card}>
          <h3 style={{ color:C.dark, margin:'0 0 6px', fontSize:16, fontWeight:700 }}>📡 Share My Location</h3>
          <p style={{ color:C.muted, fontSize:13, marginBottom:16 }}>If you are the driver, share your location so riders can track you</p>

          {!sharing ? (
            <button onClick={startSharing}
              style={{ width:'100%', background:C.primary, color:C.white, border:'none', borderRadius:12, padding:14, fontSize:15, fontWeight:700, cursor:'pointer' }}>
              📡 Start Sharing My Location
            </button>
          ) : (
            <div>
              <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:12, padding:16, marginBottom:12, display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'#16a34a', flexShrink:0 }} />
                <div>
                  <div style={{ fontWeight:700, color:'#16a34a', fontSize:14 }}>Sharing location live</div>
                  <div style={{ color:'#888', fontSize:12, marginTop:2 }}>Riders can see your position in real time</div>
                </div>
              </div>
              <button onClick={stopSharing}
                style={{ width:'100%', background:C.white, color:'#dc2626', border:'1.5px solid #fca5a5', borderRadius:12, padding:12, fontSize:14, fontWeight:600, cursor:'pointer' }}>
                ⏹ Stop Sharing
              </button>
            </div>
          )}
        </div>

        {/* Activity Log */}
        {log.length > 0 && (
          <div style={{ ...card, padding:20 }}>
            <h3 style={{ color:C.dark, margin:'0 0 12px', fontSize:15, fontWeight:700 }}>📋 Activity Log</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {log.map((l, i) => (
                <div key={i} style={{ background:C.light, border:`1px solid ${C.border}`, borderRadius:8, padding:'8px 12px', color:'#555', fontSize:12 }}>
                  {l}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}