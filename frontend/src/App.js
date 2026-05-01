import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar    from './components/Navbar';
import AIChat    from './components/AIChat';
import Home      from './pages/Home';
import Login     from './pages/Login';
import Register  from './pages/Register';
import BookRide  from './pages/BookRide';
import OfferRide from './pages/OfferRide';
import MyRides   from './pages/MyRides';
import Profile   from './pages/Profile';
import LiveTrack from './pages/LiveTrack';
import RideDetail from './pages/RideDetail';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#fff8f0' }}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/book"      element={<PrivateRoute><BookRide /></PrivateRoute>} />
          <Route path="/offer"     element={<PrivateRoute><OfferRide /></PrivateRoute>} />
          <Route path="/my-rides"  element={<PrivateRoute><MyRides /></PrivateRoute>} />
          <Route path="/profile"   element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/track/:id" element={<PrivateRoute><LiveTrack /></PrivateRoute>} />
          <Route path="/ride/:id"  element={<PrivateRoute><RideDetail /></PrivateRoute>} />
        </Routes>
      </div>
      <AIChat />
    </BrowserRouter>
  );
}