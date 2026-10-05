import { useState } from "react";
import api from "../api";


function CycleSetup() {

  const [lastPeriodDate, setLastPeriodDate] =
    useState("");

  const [cycleLength, setCycleLength] =
    useState(28);

  const [message, setMessage] =
    useState("");

  const [saving, setSaving] =
    useState(false);


  const handleSave = async (event) => {

    event.preventDefault();


    if (!lastPeriodDate) {

      setMessage(
        "Please select your last period date 🌸"
      );

      return;
    }


    const payload = {
      last_period_date: lastPeriodDate,
      cycle_length: Number(cycleLength),
    };


    console.log(
      "Sending cycle setup:",
      payload
    );


    try {

      setSaving(true);
      setMessage("");


      const response = await api.post(
        "/api/cycle/setup",
        payload
      );


      console.log(
        "Cycle setup response:",
        response.data
      );


      if (response.data.success) {

        setMessage(
          "Your cycle setup has been saved 🌸"
        );

      } else {

        setMessage(
          "Could not save your cycle setup."
        );

      }


    } catch (error) {

      console.error(
        "Cycle setup error:",
        error.response?.data || error
      );


      if (error.response?.status === 401) {

        setMessage(
          "Your session has expired. Please log in again."
        );

      } else if (
        error.response?.status === 422
      ) {

        setMessage(
          "The cycle information format is invalid. Please check the date and cycle length."
        );

      } else if (
        error.response?.data?.detail
      ) {

        setMessage(
          error.response.data.detail
        );

      } else {

        setMessage(
          "Could not save your cycle setup. Please check the backend."
        );

      }

    } finally {

      setSaving(false);

    }

  };


  return (
    <main className="page cycle-setup-page">

      <section className="page-header">

        <p className="eyebrow">
          PERSONALIZE YOUR CYCLE
        </p>

        <h1>
          Cycle Setup 🌸
        </h1>

        <p>
          Tell CycleSync a little about your cycle
          so your daily experience can adapt to you.
        </p>

      </section>


      <section className="setup-card">

        <form onSubmit={handleSave}>

          <div className="form-group">

            <label htmlFor="last-period">
              When did your last period start?
            </label>

            <input
              id="last-period"
              type="date"
              value={lastPeriodDate}
              onChange={(event) =>
                setLastPeriodDate(
                  event.target.value
                )
              }
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="cycle-length">
              Average cycle length
            </label>

            <div className="cycle-length-input">

              <input
                id="cycle-length"
                type="number"
                min="21"
                max="45"
                value={cycleLength}
                onChange={(event) =>
                  setCycleLength(
                    event.target.value
                  )
                }
                required
              />

              <span>
                days
              </span>

            </div>

            <small>
              Most cycles are around 21–35 days,
              but your cycle may be different.
            </small>

          </div>


          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : "Save Cycle Setup"}

          </button>


          {message && (
            <p className="form-message">
              {message}
            </p>
          )}

        </form>

      </section>

    </main>
  );
}


export default CycleSetup;