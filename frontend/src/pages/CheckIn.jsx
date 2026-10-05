import { useEffect, useState } from "react";
import api from "../api";


function CheckIn() {

  const [energy, setEnergy] = useState(3);
  const [mood, setMood] = useState(3);
  const [pain, setPain] = useState(0);
  const [sleep, setSleep] = useState(3);

  const [symptoms, setSymptoms] =
    useState([]);

  const [notes, setNotes] =
    useState("");

  const [existingCheckin, setExistingCheckin] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");


  const symptomOptions = [
    "Cramps",
    "Bloating",
    "Headache",
    "Fatigue",
    "Breast tenderness",
    "Mood changes",
  ];


  useEffect(() => {
    loadTodaysCheckin();
  }, []);


  const loadTodaysCheckin = async () => {

    try {

      setLoading(true);


      const response = await api.get(
        "/api/checkins/"
      );


      const checkins =
        response.data.data || [];


      const today =
        new Date()
          .toISOString()
          .split("T")[0];


      const todaysCheckin =
        checkins.find(
          (checkin) =>
            checkin.check_in_date === today
        );


      if (todaysCheckin) {

        setExistingCheckin(
          todaysCheckin
        );

        setEnergy(
          todaysCheckin.energy
        );

        setMood(
          todaysCheckin.mood
        );

        setPain(
          todaysCheckin.pain
        );

        setSleep(
          todaysCheckin.sleep
        );

        setSymptoms(
          todaysCheckin.symptoms || []
        );

        setNotes(
          todaysCheckin.notes || ""
        );

      }


    } catch (error) {

      console.error(
        "Could not load today's check-in:",
        error
      );


      if (
        error.response?.status === 401
      ) {

        setMessage(
          "Your session has expired. Please log in again."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  const toggleSymptom = (symptom) => {

    setSymptoms((current) =>

      current.includes(symptom)

        ? current.filter(
            (item) => item !== symptom
          )

        : [...current, symptom]

    );

  };


  const handleSubmit = async (event) => {

    event.preventDefault();


    try {

      setSaving(true);
      setMessage("");


      const cycleResponse =
        await api.get(
          "/api/cycle/current"
        );


      if (!cycleResponse.data.success) {

        setMessage(
          "Please set up your cycle before completing a check-in."
        );

        return;
      }


      const cycle =
        cycleResponse.data.data;


      const today =
        new Date()
          .toISOString()
          .split("T")[0];


      const response =
        await api.post(
          "/api/checkins/",
          {
            check_in_date: today,

            cycle_day:
              cycle.cycle_day,

            phase:
              cycle.phase,

            energy:
              Number(energy),

            mood:
              Number(mood),

            pain:
              Number(pain),

            sleep:
              Number(sleep),

            symptoms,

            notes,
          }
        );


      if (response.data.success) {

        setMessage(
          existingCheckin
            ? "Today's check-in has been updated 🌸"
            : "Today's check-in has been saved 🌸"
        );


        setExistingCheckin({
          ...(existingCheckin || {}),
          ...response.data.data,
        });

      }


    } catch (error) {

      console.error(
        "Error saving check-in:",
        error
      );


      if (
        error.response?.status === 401
      ) {

        setMessage(
          "Your session has expired. Please log in again."
        );

      } else if (
        error.response?.data?.detail
      ) {

        setMessage(
          error.response.data.detail
        );

      } else {

        setMessage(
          "Could not save your check-in. Please make sure your cycle is set up."
        );

      }

    } finally {

      setSaving(false);

    }

  };


  if (loading) {

    return (
      <main className="page">

        <div className="dashboard-loading">
          Loading today's check-in...
        </div>

      </main>
    );

  }


  return (
    <main className="page">

      <section className="page-header">

        <p className="eyebrow">
          DAILY SELF-CHECK
        </p>

        <h1>
          {existingCheckin
            ? "Update today's check-in 🌸"
            : "How are you feeling today? 🌸"}
        </h1>

        <p>
          A quick check-in helps CycleSync
          understand your personal patterns
          over time.
        </p>

      </section>


      <section className="setup-card">

        <form onSubmit={handleSubmit}>

          {/* ENERGY */}

          <div className="form-group">

            <label>
              Energy
            </label>

            <select
              value={energy}
              onChange={(event) =>
                setEnergy(
                  event.target.value
                )
              }
            >

              <option value="1">
                1 — Very low
              </option>

              <option value="2">
                2 — Low
              </option>

              <option value="3">
                3 — Moderate
              </option>

              <option value="4">
                4 — Good
              </option>

              <option value="5">
                5 — High
              </option>

            </select>

          </div>


          {/* MOOD */}

          <div className="form-group">

            <label>
              Mood
            </label>

            <select
              value={mood}
              onChange={(event) =>
                setMood(
                  event.target.value
                )
              }
            >

              <option value="1">
                1 — Difficult
              </option>

              <option value="2">
                2 — Low
              </option>

              <option value="3">
                3 — Neutral
              </option>

              <option value="4">
                4 — Good
              </option>

              <option value="5">
                5 — Great
              </option>

            </select>

          </div>


          {/* PAIN */}

          <div className="form-group">

            <label>
              Pain level
            </label>

            <select
              value={pain}
              onChange={(event) =>
                setPain(
                  event.target.value
                )
              }
            >

              <option value="0">
                0 — No pain
              </option>

              <option value="1">
                1 — Very mild
              </option>

              <option value="2">
                2 — Mild
              </option>

              <option value="3">
                3 — Moderate
              </option>

              <option value="4">
                4 — Strong
              </option>

              <option value="5">
                5 — Severe
              </option>

            </select>

          </div>


          {/* SLEEP */}

          <div className="form-group">

            <label>
              Sleep quality
            </label>

            <select
              value={sleep}
              onChange={(event) =>
                setSleep(
                  event.target.value
                )
              }
            >

              <option value="1">
                1 — Poor
              </option>

              <option value="2">
                2 — Below average
              </option>

              <option value="3">
                3 — Okay
              </option>

              <option value="4">
                4 — Good
              </option>

              <option value="5">
                5 — Excellent
              </option>

            </select>

          </div>


          {/* SYMPTOMS */}

          <div className="form-group">

            <label>
              Symptoms
            </label>

            <div className="symptom-options">

              {symptomOptions.map(
                (symptom) => (

                  <button
                    type="button"
                    key={symptom}
                    className={
                      symptoms.includes(
                        symptom
                      )
                        ? "symptom-option selected"
                        : "symptom-option"
                    }
                    onClick={() =>
                      toggleSymptom(
                        symptom
                      )
                    }
                  >
                    {symptom}
                  </button>

                )
              )}

            </div>

          </div>


          {/* NOTES */}

          <div className="form-group">

            <label htmlFor="notes">
              Anything else you'd like to note?
            </label>

            <textarea
              id="notes"
              rows="4"
              placeholder="Optional notes about how you're feeling..."
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
            />

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : existingCheckin
                ? "Update Today's Check-In"
                : "Save Today's Check-In"}

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


export default CheckIn;