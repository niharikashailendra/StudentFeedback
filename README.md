# SecureStudentFeedback
# 🚀 Full-Stack Application (Node.js + Express.js + MongoDB + Next.js)

This project is a **full-stack application** built with:

- **Backend** → Node.js + Express.js + MongoDB  
- **Frontend** → Next.js (React framework)  
- **Database** → MongoDB (Atlas / Self-hosted)  

---

## 📂 Project Structure

root/
│── backend/ # Express.js + MongoDB API
│ ├── src/ # API routes, models, controllers
│ ├── .env # Environment variables for backend
│ └── package.json
│
│── frontend/ # Next.js application
│ ├── pages/ # Next.js pages
│ ├── components/ # UI components
│ ├── .env.local # Environment variables for frontend
│ └── package.json
│
└── README.md



---

## ⚙️ Backend Setup (Node.js + Express + MongoDB)

### 1️⃣ Navigate to backend folder
```bash
cd backend
2️⃣ Install dependencies
bash
Copy code
npm install
3️⃣ Environment Variables (.env)
Create a .env file in the backend folder:

env
Copy code
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydb
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000,https://your-frontend.vercel.app
4️⃣ Start backend server
bash
Copy code
npm run dev   # with nodemon
# or
npm start
Backend runs on 👉 http://localhost:5000

⚙️ Frontend Setup (Next.js)
1️⃣ Navigate to frontend folder
bash
Copy code
cd frontend
2️⃣ Install dependencies
bash
Copy code
npm install
3️⃣ Environment Variables (.env.local)
Create .env.local inside frontend:

env
Copy code
NEXT_PUBLIC_API_URL=http://localhost:5000/api
For production (Vercel):

env
Copy code
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
4️⃣ Start frontend
bash
Copy code
npm run dev
Frontend runs on 👉 http://localhost:3000

🚀 Deployment
🔹 Backend (EC2 / VPS / Render / Railway)
Push backend code to server.

Install dependencies: npm install

Setup .env file on server.

Run with PM2 (recommended):

bash
Copy code
pm2 start src/index.js --name backend
🔹 Frontend (Vercel)
Push frontend to GitHub.

Connect repo to Vercel.

Add .env.local variables in Vercel settings.

Deploy 🚀

🛠 API Example
Login Request

http
Copy code
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
Login Response

json
Copy code
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "123",
    "name": "John Doe"
  }
}
✅ Tech Stack
Backend: Node.js, Express.js, MongoDB (Mongoose), JWT, CORS

Frontend: Next.js, React, TailwindCSS (optional)

Deployment: EC2 (backend) + Vercel (frontend)

👨‍💻 Development
Run backend and frontend in parallel:

bash
Copy code
# In two terminals
cd backend && npm run dev
cd frontend && npm run dev
Backend → http://localhost:5000

Frontend → http://localhost:3000

📜 License
MIT License © 2025