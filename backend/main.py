import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routes.auth import router as auth_router
from routes.checkins import router as checkin_router
from routes.cycle import router as cycle_router
from routes.fingerprint import router as fingerprint_router


load_dotenv()


app = FastAPI(title="CycleSync API")


# =========================================================
# DATABASE
# =========================================================

init_db()


# =========================================================
# CORS
# =========================================================

frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
).strip().rstrip("/")


allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]


if frontend_url and frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# ROUTES
# =========================================================

app.include_router(checkin_router)
app.include_router(cycle_router)
app.include_router(fingerprint_router)
app.include_router(auth_router)


# =========================================================
# BASIC ENDPOINTS
# =========================================================

@app.get("/")
def root():
    return {
        "message": "CycleSync API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }