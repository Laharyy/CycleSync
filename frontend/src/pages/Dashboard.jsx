import { useEffect, useState } from "react";

import {
  CalendarDays,
  Sparkles,
  ArrowRight,
  Activity,
  HeartPulse,
  CheckCircle2,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

import api from "../api";


function Dashboard() {

  const [cycle, setCycle] = useState(null);
  const [todayCheckin, setTodayCheckin] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();


  // =====================================================
  // CURRENT USER
  // =====================================================

  const storedUser =
    localStorage.getItem("cyclesync_user");

  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : null;

  const userName =
    currentUser?.name || "there";


  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    fetchDashboardData();
  }, [location]);


  const fetchDashboardData = async () => {

    try {

      setLoading(true);


      const [
        cycleResponse,
        checkinResponse,
      ] = await Promise.all([

        api.get(
          "/api/cycle/current"
        ),

        api.get(
          "/api/checkins/"
        ),

      ]);


      if (
        cycleResponse.data.success
      ) {

        setCycle(
          cycleResponse.data.data
        );

      } else {

        setCycle(null);

      }


      const checkins =
        checkinResponse.data.data || [];


      const today =
        new Date()
          .toISOString()
          .split("T")[0];


      const todaysCheckin =
        checkins.find(
          (checkin) =>
            checkin.check_in_date === today
        );


      setTodayCheckin(
        todaysCheckin || null
      );


    } catch (error) {

      console.error(
        "Could not load dashboard:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // GREETING
  // =====================================================

  const getGreeting = () => {

    const hour =
      new Date().getHours();


    if (hour < 12) {
      return "Good morning";
    }


    if (hour < 18) {
      return "Good afternoon";
    }


    return "Good evening";

  };


  // =====================================================
  // PHASE DESCRIPTION
  // =====================================================

  const getPhaseDescription = (
    phase
  ) => {

    const descriptions = {

      Menstrual:
        "A slower phase. Prioritize rest, reflection and gentle routines.",

      Follicular:
        "Energy may begin to rise. A good time for learning and fresh ideas.",

      Ovulatory:
        "A potentially social and energetic phase. Great for collaboration.",

      Luteal:
        "A more inward phase. Focus on completing tasks and protecting your energy.",

    };


    return descriptions[phase] || "";

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <main className="page">

        <div className="dashboard-loading">
          Loading your cycle...
        </div>

      </main>
    );

  }


  return (
    <main className="page dashboard-page">


      {/* HEADER */}

      <section className="dashboard-header">

        <div>

          <p className="eyebrow">
            YOUR CYCLE TODAY
          </p>

          <h1>
            {getGreeting()}, {userName} 🌸
          </h1>

          <p>
            A calmer way to understand your
            cycle and plan your day around it.
          </p>

        </div>


        {cycle && !todayCheckin && (

          <Link
            to="/check-in"
            className="primary-button dashboard-checkin"
          >

            Daily Check-In

            <ArrowRight size={17} />

          </Link>

        )}

      </section>


      {/* NO CYCLE SETUP */}

      {!cycle ? (

        <section className="dashboard-empty card">

          <div className="empty-icon">

            <CalendarDays size={26} />

          </div>

          <h2>
            Let's set up your cycle
          </h2>

          <p>
            Add your last period date and
            average cycle length to personalize
            your CycleSync experience.
          </p>

          <Link
            to="/cycle-setup"
            className="primary-button"
          >
            Set Up My Cycle
          </Link>

        </section>

      ) : (

        <>

          {/* TODAY'S CHECK-IN STATUS */}

          {todayCheckin && (

            <section className="today-status-card">

              <div className="today-status-icon">

                <CheckCircle2 size={22} />

              </div>

              <div>

                <p className="card-label">
                  TODAY'S CHECK-IN
                </p>

                <h3>
                  You're all checked in 🌸
                </h3>

                <p>

                  Energy {todayCheckin.energy}/5
                  {" · "}
                  Mood {todayCheckin.mood}/5
                  {" · "}
                  Pain {todayCheckin.pain}/5

                </p>

              </div>

            </section>

          )}


          {/* MAIN CYCLE CARDS */}

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

                    Day {cycle.cycle_day} of{" "}
                    {cycle.cycle_length}

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


            {/* TODAY'S RHYTHM */}

            <div className="weather-card card">

              <div className="card-heading">

                <div className="small-icon">

                  <Activity size={18} />

                </div>

                <div>

                  <p className="card-label">
                    TODAY'S RHYTHM
                  </p>

                  <h3>
                    {cycle.phase} energy
                  </h3>

                </div>

              </div>


              <p className="weather-description">

                {getPhaseDescription(
                  cycle.phase
                )}

              </p>


              <div className="weather-tags">

                <span>
                  Self-awareness
                </span>

                <span>
                  Gentle planning
                </span>

              </div>

            </div>

          </section>


          {/* TODAY'S NUMBERS */}

          {todayCheckin && (

            <section className="dashboard-section">

              <div className="section-heading">

                <div>

                  <p className="eyebrow">
                    TODAY AT A GLANCE
                  </p>

                  <h2>
                    How you're feeling
                  </h2>

                </div>

              </div>


              <div className="dashboard-grid">


                <div className="card dashboard-stat-card">

                  <p className="card-label">
                    ENERGY
                  </p>

                  <h2>
                    {todayCheckin.energy}/5
                  </h2>

                  <p>
                    Today's energy level
                  </p>

                </div>


                <div className="card dashboard-stat-card">

                  <p className="card-label">
                    MOOD
                  </p>

                  <h2>
                    {todayCheckin.mood}/5
                  </h2>

                  <p>
                    Today's mood
                  </p>

                </div>


                <div className="card dashboard-stat-card">

                  <p className="card-label">
                    PAIN
                  </p>

                  <h2>
                    {todayCheckin.pain}/5
                  </h2>

                  <p>
                    Today's pain level
                  </p>

                </div>


              </div>

            </section>

          )}


          {/* PERSONAL INSIGHT */}

          <section className="insight-card">

            <div className="insight-icon">

              <HeartPulse size={22} />

            </div>

            <div>

              <p className="card-label">
                PERSONAL INSIGHT
              </p>

              <h2>
                Work with your rhythm,
                not against it.
              </h2>

              <p>
                CycleSync uses your cycle phase
                and check-in patterns to help
                you notice how your energy,
                mood and symptoms change over
                time.
              </p>

            </div>

          </section>


          {/* TOOLS */}

          <section className="dashboard-section">

            <div className="section-heading">

              <div>

                <p className="eyebrow">
                  YOUR TOOLS
                </p>

                <h2>
                  Understand your patterns
                </h2>

              </div>

            </div>


            <div className="quick-actions">


              <Link
                to="/check-in"
                className="quick-card card"
              >

                <div className="quick-icon">
                  ✓
                </div>

                <div>

                  <h3>
                    Daily Check-In
                  </h3>

                  <p>
                    Record energy, mood,
                    pain and symptoms.
                  </p>

                </div>

                <ArrowRight size={18} />

              </Link>


              <Link
                to="/fingerprint"
                className="quick-card card"
              >

                <div className="quick-icon">
                  ✦
                </div>

                <div>

                  <h3>
                    Cycle Fingerprint
                  </h3>

                  <p>
                    Discover patterns unique
                    to your cycle.
                  </p>

                </div>

                <ArrowRight size={18} />

              </Link>


              <Link
                to="/patterns"
                className="quick-card card"
              >

                <div className="quick-icon">
                  ◌
                </div>

                <div>

                  <h3>
                    Patterns & Insights
                  </h3>

                  <p>
                    Turn your check-ins into
                    meaningful observations.
                  </p>

                </div>

                <ArrowRight size={18} />

              </Link>


            </div>

          </section>

        </>

      )}


      {/* WELLNESS DISCLAIMER */}

      <section className="dashboard-disclaimer">

        <p>

          <strong>
            Wellness note:
          </strong>{" "}

          CycleSync is designed for personal
          wellness awareness and planning.
          It is not a medical diagnostic tool
          and does not replace professional
          medical advice.

        </p>

      </section>


    </main>
  );
}


export default Dashboard;