import { useState, useRef, useEffect } from 'react';

const C = { primary:'#fb923c', dark:'#ea580c', light:'#fff7ed', border:'#fed7aa', white:'#fff', text:'#1a1a1a', muted:'#888' };

export default function AIChat() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState([{ role:'ai', text:'Hi! I\'m ShareGo AI 🤖\nHow can I help you today?' }]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMsgs(p => [...p, { role:'user', text:userMsg }]);
    setInput(''); setLoading(true);
    try {
      const res  = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ userMessage:userMsg }) });
      const data = await res.json();
      setMsgs(p => [...p, { role:'ai', text:data.reply || data.error }]);
    } catch { setMsgs(p => [...p, { role:'ai', text:'❌ Could not connect. Try again.' }]); }
    setLoading(false);
  };

  const suggestions = ['How does fare split work?', 'Is it safe to share rides?', 'How to offer a ride?'];

  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:999 }}>
      {open && (
        <div style={{ width:320, height:460, background:C.white, border:`2px solid ${C.primary}`, borderRadius:18, display:'flex', flexDirection:'column', boxShadow:'0 8px 32px rgba(251,146,60,0.18)', marginBottom:12 }}>
          {/* Header */}
          <div style={{ background:C.primary, padding:'12px 16px', borderRadius:'16px 16px 0 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ background:C.white, borderRadius:'50%', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🤖</div>
              <div>
                <div style={{ fontWeight:700, color:C.white, fontSize:14 }}>ShareGo AI</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.8)' }}>● Online</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background:'rgba(255,255,255,0.2)', border:'none', color:C.white, borderRadius:6, width:26, height:26, cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:12, display:'flex', flexDirection:'column', gap:8, background:'#fafafa' }}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role==='user' ? 'flex-end' : 'flex-start',
                background: m.role==='user' ? C.primary : C.white,
                color: m.role==='user' ? C.white : C.text,
                padding:'9px 12px', borderRadius:12, maxWidth:'85%',
                fontSize:13, lineHeight:1.5, whiteSpace:'pre-wrap',
                border: m.role==='ai' ? `1px solid ${C.border}` : 'none',
              }}>{m.text}</div>
            ))}
            {loading && (
              <div style={{ alignSelf:'flex-start', background:C.white, border:`1px solid ${C.border}`, color:C.muted, padding:'9px 12px', borderRadius:12, fontSize:13 }}>
                Typing...
              </div>
            )}
            {msgs.length === 1 && (
              <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:4 }}>
                {suggestions.map(s => (
                  <button key={s} onClick={() => setInput(s)}
                    style={{ background:C.white, border:`1px solid ${C.border}`, color:C.dark, borderRadius:8, padding:'7px 10px', fontSize:12, cursor:'pointer', textAlign:'left', fontWeight:500 }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding:'10px 12px', borderTop:`1px solid ${C.border}`, display:'flex', gap:8, background:C.white, borderRadius:'0 0 16px 16px' }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()}
              placeholder="Ask me anything..."
              style={{ flex:1, background:'#f9f9f9', border:`1.5px solid ${C.border}`, borderRadius:8, padding:'8px 12px', color:C.text, fontSize:13, outline:'none' }} />
            <button onClick={send} disabled={loading}
              style={{ background:C.primary, border:'none', borderRadius:8, padding:'0 14px', cursor:'pointer', color:C.white, fontSize:16, fontWeight:700 }}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button onClick={() => setOpen(o => !o)}
        style={{ background:C.primary, border:'none', borderRadius:'50%', width:56, height:56, fontSize:22, cursor:'pointer', boxShadow:'0 4px 16px rgba(251,146,60,0.4)', display:'flex', alignItems:'center', justifyContent:'center', float:'right' }}>
        {open ? '✕' : '🤖'}
      </button>
    </div>
  );
}