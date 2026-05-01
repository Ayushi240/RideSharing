# 🚗 ShareGo — AI-Powered Ride Sharing App

A full-stack ride-sharing web application where users can offer and book shared rides with AI-powered matching, dynamic fare splitting, and real-time GPS tracking.

---

## 🛠️ Tech Stack

- **Frontend** — React.js, React Router DOM
- **Backend** — Node.js, Express.js
- **Database** — MongoDB Atlas
- **AI** — Google Gemini API
- **Real-time** — WebSocket (ws)
- **Auth** — JWT (JSON Web Tokens)

---

## ✨ Features

- 🤖 AI Smart Ride Matching (Haversine Algorithm)
- 💰 Dynamic Fare Splitting based on distance
- 📍 Live GPS Tracking via WebSocket
- 🛡️ Safety Score System based on reviews
- 👩 Women-Only Ride Filter
- 🌱 CO₂ Savings Tracker
- 🔐 JWT Authentication

---

## 🚀 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/Ayushi240/RideSharing.git
cd RideSharing
```

### 2. Install backend packages

```bash
cd server
npm install
```

### 3. Install frontend packages

```bash
cd ../frontend
npm install
```

### 4. Create `server/.env`

Create a file called `.env` inside the `server/` folder and add:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=any_random_string
GEMINI_API_KEY=your_gemini_key
PORT=5000
```

### 5. Create `frontend/.env`

Create a file called `.env` inside the `frontend/` folder and add:

```
REACT_APP_WS_URL=ws://localhost:5000
REACT_APP_API_URL=http://localhost:5000
```

### 6. Run backend

```bash
cd server
nodemon index.js
```

### 7. Run frontend

Open a new terminal:

```bash
cd frontend
npm start
```

App runs at **http://localhost:3000** ✅

---

## 📁 Project Structure

```
RideSharing/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Ride.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── rides.js
│   │   ├── bookings.js
│   │   └── chat.js
│   ├── middleware/
│   │   └── auth.js
│   ├── index.js
│   └── .env
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   └── AIChat.jsx
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── BookRide.jsx
            ├── OfferRide.jsx
            ├── MyRides.jsx
            ├── Profile.jsx
            ├── LiveTrack.jsx
            └── RideDetail.jsx
