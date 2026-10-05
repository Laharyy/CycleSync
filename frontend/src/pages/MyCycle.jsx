import { useEffect, useState } from "react";

import {
  CalendarDays,
  Sparkles,
  HeartPulse,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../api";


function MyCycle() {

  const [cycle, setCycle] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchCycle();
  }, []);


  const fetchCycle = async () => {

    try {

      setLoading(true);


      const response =
        await api.get(
          "/api/cycle/current"
        );


      if (response.data.success) {

        setCycle(
          response.data.data
        );

      } else {

        setCycle(null);

      }


    } catch (error) {

      console.error(
        "Could not load cycle:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  if (loading) {

    return (
      <main className="page">

        <div className="dashboard-loading">
          Loading your cycle...
        </div>

      </main>
    );

  }


  if (!cycle) {

    return (
      <main className="page">

        <section className="page-header">

          <p className="eyebrow">
            YOUR CYCLE
          </p>

          <h1>
            My Cycle 🌸
          </h1>

          <p>
            Set up your cycle to see your current
            phase, cycle day and progress here.
          </p>

        </section>


        <section className="dashboard-empty card">

          <div className="empty-icon">

            <CalendarDays size={26} />

          </div>


          <h2>
            No cycle setup yet
          </h2>


          <p>
            Add your last period date and average
            cycle length to personalize your
            CycleSync experience.
          </p>


          <Link
            to="/cycle-setup"
            className="primary-button"
          >
            Set Up My Cycle
          </Link>

        </section>

      </main>
    );

  }


  return (
    <main className="page">


      {/* PAGE HEADER */}

      <section className="page-header">

        <p className="eyebrow">
          YOUR CYCLE
        </p>

        <h1>
          My Cycle 🌸
        </h1>

        <p>
          A simple view of where you are in your
          current cycle.
        </p>

      </section>


      {/* CYCLE OVERVIEW */}

      <section className="dashboard-grid">


        {/* CURRENT PHASE */}

        <div className="phase-card">

          <div className="phase-card-top">

            <div>

              <p className="card-label">
                CURRENT PHASE
              </p>

              <h2>
                {cycle.phase}
              </h2>

              <p className="phase-day">
                Cycle Day {cycle.cycle_day}
              </p>

            </div>


            <div className="phase-icon">

              <Sparkles size={23} />

            </div>

          </div>


          <div className="progress-section">

            <div className="progress-header">

              <span>
                Cycle progress
              </span>

              <strong>
                {cycle.progress}%
              </strong>

            </div>


            <div className="progress-track">

              <div
                className="progress-fill"
                style={{
                  width:
                    `${cycle.progress}%`,
                }}
              />

            </div>

          </div>

        </div>


        {/* CYCLE DETAILS */}

        <div
          className="card"
          style={{
            padding: "30px",
          }}
        >

          <div className="card-heading">

            <div className="small-icon">

              <HeartPulse size={18} />

            </div>


            <div>

              <p className="card-label">
                CYCLE DETAILS
              </p>

              <h3>
                Your current cycle
              </h3>

            </div>

          </div>


          <div
            style={{
              marginTop: "28px",
            }}
          >

            <p
              style={{
                color: "#766b7d",
                marginBottom: "12px",
              }}
            >
              Cycle length
            </p>


            <strong
              style={{
                fontSize: "24px",
                color: "#45394e",
              }}
            >
              {cycle.cycle_length} days
            </strong>

          </div>


          <div
            style={{
              marginTop: "24px",
            }}
          >

            <p
              style={{
                color: "#766b7d",
                marginBottom: "12px",
              }}
            >
              Last period started
            </p>


            <strong
              style={{
                fontSize: "17px",
                color: "#45394e",
              }}
            >
              {cycle.last_period_date}
            </strong>

          </div>

        </div>

      </section>


      {/* CYCLE AWARENESS */}

      <section className="insight-card">

        <div className="insight-icon">

          <Sparkles size={22} />

        </div>


        <div>

          <p className="card-label">
            CYCLE AWARENESS
          </p>

          <h2>
            Notice your rhythm over time.
          </h2>

          <p>
            CycleSync uses your cycle information
            as a planning framework. Your daily
            check-ins can help you notice how your
            energy, mood and symptoms vary
            throughout your cycle.
          </p>

        </div>

      </section>


    </main>
  );
}


export default MyCycle;