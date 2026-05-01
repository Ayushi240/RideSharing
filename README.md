# ShareGo — AI Ride Sharing App

## Tech Stack
MERN Stack + Gemini AI + WebSocket

## Setup Instructions

### 1. Clone the repo
git clone https://github.com/yourname/sharego.git
cd sharego

### 2. Install backend packages
cd server
npm install

### 3. Install frontend packages
cd ../client
npm install

### 4. Create server/.env
MONGO_URI=your_mongodb_uri
JWT_SECRET=any_random_string
GEMINI_API_KEY=your_gemini_key
PORT=5000

### 5. Create client/.env
REACT_APP_WS_URL=ws://localhost:5000
REACT_APP_API_URL=http://localhost:5000

### 6. Run backend
cd server
nodemon index.js

### 7. Run frontend
cd client
npm start
