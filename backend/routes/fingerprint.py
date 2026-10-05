import json

from fastapi import APIRouter, Depends

from auth import get_current_user
from database import get_connection


router = APIRouter(
    prefix="/api/fingerprint",
    tags=["Fingerprint"],
)


def interpret_energy(value):

    if value >= 4:
        return "Your recorded energy has generally been good."

    elif value >= 3:
        return "Your recorded energy has been fairly steady."

    else:
        return (
            "Your recorded energy has generally "
            "been on the lower side."
        )


def interpret_mood(value):

    if value >= 4:
        return "Your recorded mood has generally been positive."

    elif value >= 3:
        return "Your recorded mood has been fairly balanced."

    else:
        return "Your recorded mood has generally been lower."


def interpret_pain(value):

    if value <= 1:
        return (
            "You have recorded little to no pain on average."
        )

    elif value <= 3:
        return (
            "You have recorded some moderate discomfort."
        )

    else:
        return (
            "You have recorded higher levels of discomfort."
        )


def get_data_strength(total_checkins):

    if total_checkins < 3:

        return {
            "level": "Getting started",
            "message": (
                "Complete a few more check-ins before "
                "drawing stronger personal patterns."
            ),
        }


    if total_checkins < 7:

        return {
            "level": "Early pattern",
            "message": (
                "Your data is beginning to form a personal "
                "picture. More check-ins will make it clearer."
            ),
        }


    return {
        "level": "Growing pattern",
        "message": (
            "You have enough recorded check-ins to start "
            "looking for more meaningful recurring patterns."
        ),
    }


@router.get("/")
def get_fingerprint(
    current_user=Depends(get_current_user),
):

    user_id = current_user["id"]

    connection = get_connection()


    rows = connection.execute(
        """
        SELECT
            energy,
            mood,
            pain,
            symptoms
        FROM checkins

        WHERE user_id = ?

        ORDER BY
            check_in_date ASC,
            id ASC
        """,
        (user_id,),
    ).fetchall()


    connection.close()


    if not rows:

        return {
            "success": True,
            "has_data": False,
            "message": (
                "Complete a few check-ins to build "
                "your Personal Cycle Fingerprint."
            ),
            "data": None,
        }


    total = len(rows)


    average_energy = round(
        sum(
            row["energy"]
            for row in rows
        ) / total,
        1,
    )


    average_mood = round(
        sum(
            row["mood"]
            for row in rows
        ) / total,
        1,
    )


    average_pain = round(
        sum(
            row["pain"]
            for row in rows
        ) / total,
        1,
    )


    symptom_counts = {}


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


        for symptom in symptoms:

            symptom_counts[symptom] = (
                symptom_counts.get(
                    symptom,
                    0,
                ) + 1
            )


    common_symptoms = sorted(
        [
            {
                "symptom": symptom,
                "count": count,
            }

            for symptom, count
            in symptom_counts.items()
        ],

        key=lambda item: item["count"],

        reverse=True,
    )


    data_strength = get_data_strength(
        total
    )


    return {
        "success": True,
        "has_data": True,

        "data": {

            "check_ins": total,

            "average_energy":
                average_energy,

            "average_mood":
                average_mood,

            "average_pain":
                average_pain,

            "energy_insight":
                interpret_energy(
                    average_energy
                ),

            "mood_insight":
                interpret_mood(
                    average_mood
                ),

            "pain_insight":
                interpret_pain(
                    average_pain
                ),

            "common_symptoms":
                common_symptoms,

            "data_strength":
                data_strength,

            "disclaimer": (
                "These observations are based only on "
                "your recorded check-ins and are intended "
                "for personal wellness awareness, not "
                "medical diagnosis."
            ),
        },
    }