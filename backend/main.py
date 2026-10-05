import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db

from routes.checkins import router as checkin_router
from routes.cycle import router as cycle_router
from routes.fingerprint import router as fingerprint_router
from routes.auth import router as auth_router


app = FastAPI(
    title="CycleSync API"
)


# =========================================================
# DATABASE
# =========================================================

init_db()


# =========================================================
# CORS CONFIGURATION
# =========================================================

frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
)

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

# Add the production frontend URL if configured
if frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# API ROUTES
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