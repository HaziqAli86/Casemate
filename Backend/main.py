# backend/main.py
from fastapi import FastAPI
import firebase_admin
from firebase_admin import credentials
from core.config import settings # Import the settings object
from routers import chat  # Import the chat router
from fastapi.middleware.cors import CORSMiddleware # <<< 1. IMPORT THIS

# --- Firebase Admin SDK Initialization ---
try:
    # Initialize Firebase with credentials from the path specified in .env
    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred)
    print("Firebase Admin SDK initialized successfully.")
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")
# -----------------------------------------


app = FastAPI(
    title="Pakistani Law Chatbot API",
    description="API for the AI-powered Pakistani Law Chatbot",
    version="0.1.0"
)

origins = [
    "http://localhost:3000",  # The address of your Next.js frontend
    # You can add your deployed frontend URL here later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Specifies which origins are allowed
    allow_credentials=True,      # Allows cookies and auth headers
    allow_methods=["*"],         # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],         # Allows all headers
)   

app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to the Law Chatbot API!"}

# We will add our chat router here later
# from routers import chat
# app.include_router(chat.router)