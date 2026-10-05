from datetime import date

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from auth import get_current_user
from models import get_cycle_setup, save_cycle_setup


router = APIRouter(
    prefix="/api/cycle",
    tags=["Cycle"],
)


class CycleSetupRequest(BaseModel):
    last_period_date: date
    cycle_length: int = 28


def calculate_cycle_day(
    last_period_date: date,
    cycle_length: int,
):
    today = date.today()

    days_since_start = (
        today - last_period_date
    ).days

    return (
        days_since_start % cycle_length
    ) + 1


def calculate_phase(cycle_day: int):

    if 1 <= cycle_day <= 5:
        return "Menstrual"

    elif 6 <= cycle_day <= 13:
        return "Follicular"

    elif cycle_day == 14:
        return "Ovulatory"

    else:
        return "Luteal"


@router.post("/setup")
def save_cycle(
    data: CycleSetupRequest,
    current_user=Depends(get_current_user),
):

    user_id = current_user["id"]


    save_cycle_setup(
        user_id,
        str(data.last_period_date),
        data.cycle_length,
    )


    return {
        "success": True,
        "message": "Cycle setup saved successfully",
        "data": {
            "last_period_date": str(
                data.last_period_date
            ),
            "cycle_length": data.cycle_length,
        },
    }


@router.get("/current")
def get_current_cycle(
    current_user=Depends(get_current_user),
):

    user_id = current_user["id"]


    setup = get_cycle_setup(
        user_id
    )


    if not setup:

        return {
            "success": False,
            "message": "Cycle setup not found",
        }


    last_period_date = date.fromisoformat(
        setup["last_period_date"]
    )

    cycle_length = setup["cycle_length"]


    cycle_day = calculate_cycle_day(
        last_period_date,
        cycle_length,
    )


    phase = calculate_phase(
        cycle_day
    )


    progress = round(
        (cycle_day / cycle_length) * 100
    )


    return {
        "success": True,
        "data": {
            "cycle_day": cycle_day,
            "cycle_length": cycle_length,
            "phase": phase,
            "progress": min(
                progress,
                100,
            ),
            "last_period_date": str(
                last_period_date
            ),
        },
    }