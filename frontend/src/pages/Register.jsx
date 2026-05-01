import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const C = { primary:'#fb923c', dark:'#ea580c', light:'#fff7ed', border:'#fed7aa', white:'#fff', text:'#1a1a1a', muted:'#888' };

const S = {
  page:  { minHeight:'100vh', background:'#fff8f0', display:'flex', alignItems:'center', justifyContent:'center', padding:24 },
  box:   { background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:40, width:'100%', maxWidth:420, boxShadow:'0 4px 24px rgba(251,146,60,0.08)' },
  label: { display:'block', color:'#555', fontSize:13, marginBottom:6, fontWeight:600 },
  input: { width:'100%', background:'#fff', border:`1.5px solid ${C.border}`, borderRadius:10, padding:'12px 14px', color:C.text, fontSize:14, outline:'none', boxSizing:'border-box', marginBottom:16 },
  btn:   { width:'100%', background:C.primary, color:C.white, border:'none', borderRadius:10, padding:14, fontSize:16, fontWeight:700, cursor:'pointer', marginTop:4 },
  err:   { background:'#fff5f5', border:'1px solid #fca5a5', color:'#dc2626', borderRadius:8, padding:'10px 14px', fontSize:13, marginBottom:16 },
  link:  { color:C.dark, textDecoration:'none', fontWeight:600 },
  foot:  { textAlign:'center', color:C.muted, fontSize:14, marginTop:20 },
};


export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', gender:'other' });
  const [err, setErr]   = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const f   = k => e => setForm({...form, [k]:e.target.value});

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setErr('');
    try {
      const res  = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) return setErr(data.msg);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      nav('/');
    } catch { setErr('Connection error. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <div style={{ ...S.box, maxWidth:460 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ background:C.primary, borderRadius:14, width:52, height:52, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, margin:'0 auto 12px' }}>🚗</div>
          <div style={{ fontWeight:900, fontSize:24, color:C.text }}><span style={{ color:C.dark }}>Share</span>Go</div>
          <div style={{ color:C.muted, fontSize:14, marginTop:4 }}>Join thousands of smart commuters</div>
        </div>
        {err && <div style={S.err}>⚠️ {err}</div>}
        <form onSubmit={submit}>
          <label style={S.label}>Full Name</label>
          <input required style={S.input} placeholder="John Doe" onChange={f('name')} />
          <label style={S.label}>Email Address</label>
          <input type="email" required style={S.input} placeholder="you@example.com" onChange={f('email')} />
          <label style={S.label}>Phone Number</label>
          <input style={S.input} placeholder="+91 9876543210" onChange={f('phone')} />
          <label style={S.label}>Gender</label>
          <select style={{ ...S.input }} onChange={f('gender')}>
            <option value="other">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <label style={S.label}>Password</label>
          <input type="password" required style={S.input} placeholder="Min 6 characters" onChange={f('password')} />
          <button type="submit" style={S.btn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account 🚀'}
          </button>
        </form>
        <p style={S.foot}>Have account? <Link to="/login" style={S.link}>Login here</Link></p>
      </div>
    </div>
  );
}