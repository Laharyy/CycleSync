import os

from dotenv import load_dotenv


from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from database import get_connection


load_dotenv()

# =========================================================
# JWT CONFIGURATION
# =========================================================

SECRET_KEY = os.getenv(
    "CYCLESYNC_SECRET_KEY",
    "cyclesync-development-secret-change-before-deployment",
)

ALGORITHM = "HS256"


security = HTTPBearer()


# =========================================================
# GET CURRENT USER
# =========================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    )
):

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token.",
            )

        user_id = int(user_id)

    except (
        JWTError,
        ValueError,
        TypeError,
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token.",
        )


    connection = get_connection()


    user = connection.execute(
        """
        SELECT
            id,
            name,
            email
        FROM users
        WHERE id = ?
        LIMIT 1
        """,
        (user_id,),
    ).fetchone()


    connection.close()


    if not user:

        raise HTTPException(
            status_code=401,
            detail="User account not found.",
        )


    return user