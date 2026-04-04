# ScriptBuddy 🎬🤖

![ScriptBuddy](https://img.shields.io/badge/Status-Active-success)
![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-blue)
![Backend](https://img.shields.io/badge/Backend-Python%20%7C%20Flask%20%7C%20MongoDB-green)

ScriptBuddy is an AI-powered YouTube / Video script analyzer and optimizer. It helps content creators tighten their pacing, improve their hooks, increase viewer engagement, and predict watch time by analyzing video scripts using machine learning capabilities and heuristic models.

## ✨ Features

- **🧠 Deep AI Script Analysis**: Analyzes your video scripts for hook strength, filler word density, and emotional intensity.
- **📈 Script Optimization**: Automatically restructures hooks, removes filler words (like "um", "uh", "literally"), and adds strong Calls to Action (CTAs).
- **⏱️ Retention & Watch Time Prediction**: Predicts estimated watch time and retention percentage based on script duration and optimized scores.
- **🔐 Multi-User Data Isolation**: Secure registration and login. Each creator has an isolated personal profile, keeping script history private.
- **📚 Script Library**: Search through a library of high-performing scripts categorized by niche.
- **📊 Creator Dashboard**: Keep track of your script history, improvements, and channel niche setups.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend**: Python, Flask, PyMongo
- **Database**: MongoDB (Local or Atlas)
- **Other**: Embla Carousel, React Query, Recharts

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) & npm
- [Python 3.8+](https://www.python.org/downloads/)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally on default port `27017` or change `MONGO_URI` in your `.env` file)

### Frontend Setup

1. Open a terminal and navigate to the root directory.
2. Install the necessary Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

### Backend Setup

1. Open a new terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```
   *The backend will run on `http://localhost:5000`.*

---

## 📡 API Endpoints

Here are some of the core backend endpoints exposed by the Flask application:

### Authentication & Users
- `POST /api/auth/register` - Register a new user profile
- `POST /api/auth/login` - Authenticate an existing user
- `GET /api/profile` - Fetch current user's profile metadata

### Analysis
- `POST /api/analyze` - Process and optimize a given script
- `GET /api/history` - Retrieve a user's analysis history
- `GET /api/results/<id>` - Retrieve specific analysis results by ID

### Library Generation
- `POST /api/generate/title` - Generate boilerplate scripts by title and niche
- `GET /api/library/search` - Search stored high-performing scripts
- `GET /api/library/random` - Retrieve random library samples

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/your-username/scriptbuddy/issues) if you want to contribute.

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
