import hashlib
import hmac
import os
import secrets
from datetime import datetime, timezone, timedelta

from dotenv import load_dotenv

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from jose import jwt

from database import get_connection

load_dotenv()


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


# =========================================================
# JWT CONFIGURATION
# =========================================================

SECRET_KEY = os.getenv(
    "CYCLESYNC_SECRET_KEY",
    "cyclesync-development-secret-change-before-deployment",
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


# =========================================================
# REQUEST MODELS
# =========================================================

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# =========================================================
# PASSWORD HASHING
# =========================================================

def hash_password(password: str) -> str:

    salt = secrets.token_bytes(16)

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        310_000,
    )

    return (
        f"pbkdf2_sha256$310000$"
        f"{salt.hex()}$"
        f"{password_hash.hex()}"
    )


def verify_password(
    password: str,
    stored_hash: str,
) -> bool:

    try:

        algorithm, iterations, salt_hex, hash_hex = (
            stored_hash.split("$")
        )

        if algorithm != "pbkdf2_sha256":
            return False

        salt = bytes.fromhex(salt_hex)

        expected_hash = bytes.fromhex(hash_hex)

        actual_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt,
            int(iterations),
        )

        return hmac.compare_digest(
            actual_hash,
            expected_hash,
        )

    except (ValueError, TypeError):

        return False


# =========================================================
# JWT TOKEN
# =========================================================

def create_access_token(user_id: int):

    expires_at = datetime.now(
        timezone.utc
    ) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


# =========================================================
# SIGNUP
# =========================================================

@router.post("/signup")
def signup(data: SignupRequest):

    name = data.name.strip()

    email = str(
        data.email
    ).lower().strip()


    if len(name) < 2:

        raise HTTPException(
            status_code=400,
            detail="Please enter your name.",
        )


    if len(data.password) < 8:

        raise HTTPException(
            status_code=400,
            detail=(
                "Password must be at least "
                "8 characters long."
            ),
        )


    connection = get_connection()


    existing_user = connection.execute(
        """
        SELECT id
        FROM users
        WHERE email = ?
        LIMIT 1
        """,
        (email,),
    ).fetchone()


    if existing_user:

        connection.close()

        raise HTTPException(
            status_code=409,
            detail=(
                "An account with this email "
                "already exists."
            ),
        )


    password_hash = hash_password(
        data.password
    )


    created_at = datetime.now(
        timezone.utc
    ).isoformat()


    cursor = connection.execute(
        """
        INSERT INTO users (
            name,
            email,
            password_hash,
            created_at
        )
        VALUES (?, ?, ?, ?)
        """,
        (
            name,
            email,
            password_hash,
            created_at,
        ),
    )


    connection.commit()

    user_id = cursor.lastrowid

    connection.close()


    token = create_access_token(
        user_id
    )


    return {
        "success": True,
        "message": (
            "Your CycleSync account has "
            "been created successfully."
        ),
        "data": {
            "user_id": user_id,
            "name": name,
            "email": email,
            "access_token": token,
            "token_type": "bearer",
        },
    }


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(data: LoginRequest):

    email = str(
        data.email
    ).lower().strip()


    connection = get_connection()


    user = connection.execute(
        """
        SELECT
            id,
            name,
            email,
            password_hash
        FROM users
        WHERE email = ?
        LIMIT 1
        """,
        (email,),
    ).fetchone()


    connection.close()


    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )


    password_is_valid = verify_password(
        data.password,
        user["password_hash"],
    )


    if not password_is_valid:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )


    token = create_access_token(
        user["id"]
    )


    return {
        "success": True,
        "message": "Login successful.",
        "data": {
            "user_id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "access_token": token,
            "token_type": "bearer",
        },
    }