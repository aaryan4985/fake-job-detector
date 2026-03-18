# Fake Job Detection System
AI-Powered full-stack application to detect fraudulent job postings using Machine Learning, Natural Language Processing, and a Rule-Based Engine.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB
- **Machine Learning**: Python, Flask, scikit-learn, NLTK, pandas

## Project Structure
- `/client` - React Frontend
- `/server` - Node.js + Express Backend
- `/ml-model` - Python ML Model and API

## Setup Instructions

### Prerequisites
1. Node.js (v18+)
2. Python (3.9+)
3. MongoDB (Running locally on default port 27017)

### 1. Setup ML Model (Python)
Navigate to the `ml-model` directory and create a virtual environment:
```bash
cd ml-model
python -m venv venv
# Activate the environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the training script (this will create sample_data.csv if Kaggle dataset is not found, and outputs model.pkl)
python train.py

# Start the Flask API server
python app.py
```
The model will run on `http://localhost:5000`

### 2. Setup Backend Server (Node.js)
Open a new terminal and navigate to the `server` directory:
```bash
cd server

# Install dependencies
npm install

# Make sure you have MongoDB running locally!
# Start the Express server
npm run dev
```
The server will run on `http://localhost:5001`

### 3. Setup Frontend (React)
Open a new terminal and navigate to the `client` directory:
```bash
cd client

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend will open on `http://localhost:5173`

## Features
- Deep text analysis using TF-IDF and Logistic Regression
- Hard rules fallback for obvious red flags (generic emails, suspicious keywords)
- Beautiful Dark/Light mode UI with real-time feedback
- Full history tracking of analyzed jobs

## Sample Test Data
Try these samples in the application:

**Fake Job Test**
- *Title*: Data Entry Clerk Work From Home
- *Description*: Earn quick money just by typing strings! Contact generic@yahoo.com or send a wire transfer to start. No experience needed! Get $5000 weekly!
- *Reason*: Multiple suspicious keywords, no company profile, generic email.

**Real Job Test**
- *Title*: Senior Software Engineer
- *Description*: We are looking for an experienced Software Engineer with 5+ years of experience in Node.js, AWS, and modern architecture. You will be building scalable systems. Apply through our official portal hr@techcompany.com.
- *Company*: TechCompany is an innovative startup backed by top VCs...
