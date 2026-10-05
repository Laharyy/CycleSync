import { useEffect, useState } from "react";

import {
  Sparkles,
  TrendingUp,
  HeartPulse,
  Activity,
  ShieldCheck,
} from "lucide-react";

import api from "../api";


function Patterns() {

  const [fingerprint, setFingerprint] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    fetchPatterns();
  }, []);


  const fetchPatterns = async () => {

    try {

      setLoading(true);
      setError("");


      const response =
        await api.get(
          "/api/fingerprint/"
        );


      if (response.data.success) {

        setFingerprint(
          response.data
        );

      }


    } catch (error) {

      console.error(
        "Could not load patterns:",
        error
      );


      if (
        error.response?.status === 401
      ) {

        setError(
          "Your session has expired. Please log in again."
        );

      } else {

        setError(
          "Could not load your patterns. Please try again."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  if (loading) {

    return (
      <main className="page">

        <div className="dashboard-loading">
          Looking for your patterns...
        </div>

      </main>
    );

  }


  if (error) {

    return (
      <main className="page">

        <section className="page-header">

          <p className="eyebrow">
            YOUR PERSONAL INSIGHTS
          </p>

          <h1>
            Patterns & Insights ✦
          </h1>

        </section>


        <section className="dashboard-empty card">

          <div className="empty-icon">
            <TrendingUp size={26} />
          </div>

          <h2>
            We couldn't load your patterns
          </h2>

          <p>
            {error}
          </p>

        </section>

      </main>
    );

  }


  if (!fingerprint?.has_data) {

    return (
      <main className="page">

        <section className="page-header">

          <p className="eyebrow">
            YOUR PERSONAL INSIGHTS
          </p>

          <h1>
            Patterns & Insights ✦
          </h1>

          <p>
            As you complete check-ins,
            CycleSync can help you notice
            recurring patterns in your wellbeing.
          </p>

        </section>


        <section className="dashboard-empty card">

          <div className="empty-icon">
            <TrendingUp size={26} />
          </div>

          <h2>
            Your patterns are still emerging
          </h2>

          <p>
            Complete a few daily check-ins
            first. Once you have enough
            information, this space will show
            observations based on your recorded
            data.
          </p>

        </section>

      </main>
    );

  }


  const data =
    fingerprint.data;


  return (
    <main className="page">


      {/* PAGE HEADER */}

      <section className="page-header">

        <p className="eyebrow">
          YOUR PERSONAL INSIGHTS
        </p>

        <h1>
          Patterns & Insights ✦
        </h1>

        <p>
          A simple view of what your check-ins
          are beginning to reveal about your
          personal rhythm.
        </p>

      </section>


      {/* DATA STRENGTH */}

      <section className="insight-card">

        <div className="insight-icon">
          <Sparkles size={22} />
        </div>


        <div>

          <p className="card-label">
            {data.data_strength.level.toUpperCase()}
          </p>

          <h2>
            Your cycle story is taking shape.
          </h2>

          <p>
            {data.data_strength.message}
          </p>

        </div>

      </section>


      {/* INSIGHT CARDS */}

      <section className="dashboard-grid">


        <div className="card pattern-insight-card">

          <div className="pattern-icon">
            <Activity size={20} />
          </div>

          <p className="card-label">
            ENERGY
          </p>

          <h2 className="pattern-value">
            {data.average_energy}/5
          </h2>

          <p className="pattern-description">
            {data.energy_insight}
          </p>

        </div>


        <div className="card pattern-insight-card">

          <div className="pattern-icon">
            <Sparkles size={20} />
          </div>

          <p className="card-label">
            MOOD
          </p>

          <h2 className="pattern-value">
            {data.average_mood}/5
          </h2>

          <p className="pattern-description">
            {data.mood_insight}
          </p>

        </div>


        <div className="card pattern-insight-card">

          <div className="pattern-icon">
            <HeartPulse size={20} />
          </div>

          <p className="card-label">
            PAIN
          </p>

          <h2 className="pattern-value">
            {data.average_pain}/5
          </h2>

          <p className="pattern-description">
            {data.pain_insight}
          </p>

        </div>


      </section>


      {/* COMMON SYMPTOMS */}

      <section className="card pattern-section">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              RECORDED SYMPTOMS
            </p>

            <h2>
              What you've noticed
            </h2>

          </div>

        </div>


        {data.common_symptoms.length === 0 ? (

          <p className="pattern-empty">
            No symptoms have been recorded yet.
          </p>

        ) : (

          <div className="symptom-summary">

            {data.common_symptoms.map(
              (item) => (

                <div
                  className="symptom-summary-item"
                  key={item.symptom}
                >

                  <span>
                    {item.symptom}
                  </span>

                  <strong>
                    {item.count}{" "}
                    {item.count === 1
                      ? "time"
                      : "times"}
                  </strong>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* DATA SUMMARY */}

      <section className="card pattern-section">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              YOUR DATA
            </p>

            <h2>
              {data.check_ins} check-in
              {data.check_ins !== 1
                ? "s"
                : ""}{" "}
              recorded
            </h2>

          </div>


          <div className="pattern-data-icon">
            <ShieldCheck size={20} />
          </div>

        </div>


        <p className="pattern-description">

          CycleSync builds these observations
          only from the information you choose
          to record. The more consistently you
          check in, the more useful your personal
          pattern view can become.

        </p>

      </section>


      {/* WELLNESS DISCLAIMER */}

      <section className="pattern-disclaimer">

        <ShieldCheck size={18} />

        <p>
          {data.disclaimer}
        </p>

      </section>


    </main>
  );
}


export default Patterns;