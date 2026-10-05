import json

from datetime import date

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from auth import get_current_user
from database import get_connection


router = APIRouter(
    prefix="/api/checkins",
    tags=["Check-ins"],
)


class CheckIn(BaseModel):
    check_in_date: date
    cycle_day: int
    phase: str
    energy: int
    mood: int
    pain: int
    sleep: int
    symptoms: list[str] = []
    notes: str = ""


@router.post("/")
def create_or_update_checkin(
    checkin: CheckIn,
    current_user=Depends(get_current_user),
):

    user_id = current_user["id"]

    connection = get_connection()


    # Check whether THIS USER already has
    # a check-in for this date.

    existing = connection.execute(
        """
        SELECT id
        FROM checkins
        WHERE user_id = ?
          AND check_in_date = ?
        LIMIT 1
        """,
        (
            user_id,
            str(checkin.check_in_date),
        ),
    ).fetchone()


    if existing:

        connection.execute(
            """
            UPDATE checkins

            SET
                cycle_day = ?,
                phase = ?,
                energy = ?,
                mood = ?,
                pain = ?,
                sleep = ?,
                symptoms = ?,
                notes = ?

            WHERE id = ?
              AND user_id = ?
            """,
            (
                checkin.cycle_day,
                checkin.phase,
                checkin.energy,
                checkin.mood,
                checkin.pain,
                checkin.sleep,
                json.dumps(
                    checkin.symptoms
                ),
                checkin.notes,
                existing["id"],
                user_id,
            ),
        )

        message = (
            "Today's check-in has been "
            "updated successfully."
        )


    else:

        connection.execute(
            """
            INSERT INTO checkins (
                user_id,
                check_in_date,
                cycle_day,
                phase,
                energy,
                mood,
                pain,
                sleep,
                symptoms,
                notes
            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                str(checkin.check_in_date),
                checkin.cycle_day,
                checkin.phase,
                checkin.energy,
                checkin.mood,
                checkin.pain,
                checkin.sleep,
                json.dumps(
                    checkin.symptoms
                ),
                checkin.notes,
            ),
        )

        message = (
            "Today's check-in has been "
            "saved successfully."
        )


    connection.commit()
    connection.close()


    return {
        "success": True,
        "message": message,
        "data": checkin.model_dump(),
    }


@router.get("/")
def get_checkins(
    current_user=Depends(get_current_user),
):

    user_id = current_user["id"]

    connection = get_connection()


    rows = connection.execute(
        """
        SELECT *
        FROM checkins

        WHERE user_id = ?

        ORDER BY
            check_in_date DESC,
            id DESC
        """,
        (user_id,),
    ).fetchall()


    connection.close()


    checkins = []


    for row in rows:

        try:

            symptoms = json.loads(
                row["symptoms"] or "[]"
            )

        except (
            json.JSONDecodeError,
            TypeError,
        ):

            symptoms = []


        checkins.append({
            "id": row["id"],
            "check_in_date": row["check_in_date"],
            "cycle_day": row["cycle_day"],
            "phase": row["phase"],
            "energy": row["energy"],
            "mood": row["mood"],
            "pain": row["pain"],
            "sleep": row["sleep"],
            "symptoms": symptoms,
            "notes": row["notes"] or "",
        })


    return {
        "count": len(checkins),
        "data": checkins,
    }