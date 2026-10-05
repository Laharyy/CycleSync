import { useEffect, useState } from "react";
import {
  Fingerprint as FingerprintIcon,
  Sparkles,
} from "lucide-react";

import api from "../api";


function Fingerprint() {

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    fetchFingerprint();
  }, []);


  const fetchFingerprint = async () => {

    try {

      setLoading(true);
      setError("");


      const response =
        await api.get(
          "/api/fingerprint/"
        );


      if (response.data.success) {

        setData(
          response.data
        );

      }


    } catch (error) {

      console.error(
        "Could not load fingerprint:",
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
          "Could not load your cycle fingerprint. Please try again."
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
          Building your cycle fingerprint...
        </div>

      </main>
    );

  }


  if (error) {

    return (
      <main className="page">

        <section className="page-header">

          <p className="eyebrow">
            YOUR PERSONAL PATTERN
          </p>

          <h1>
            Personal Cycle Fingerprint ✦
          </h1>

        </section>


        <section className="dashboard-empty card">

          <div className="empty-icon">
            <FingerprintIcon size={26} />
          </div>

          <h2>
            We couldn't load your fingerprint
          </h2>

          <p>
            {error}
          </p>

        </section>

      </main>
    );

  }


  return (
    <main className="page">

      <section className="page-header">

        <p className="eyebrow">
          YOUR PERSONAL PATTERN
        </p>

        <h1>
          Personal Cycle Fingerprint ✦
        </h1>

        <p>
          Over time, your check-ins can help
          reveal patterns that are unique to
          your cycle experience.
        </p>

      </section>


      {!data?.has_data ? (

        <section className="dashboard-empty card">

          <div className="empty-icon">
            <FingerprintIcon size={26} />
          </div>

          <h2>
            Your fingerprint is still forming
          </h2>

          <p>
            Complete a few daily check-ins
            and CycleSync will start building
            a picture of your personal energy,
            mood and symptom patterns.
          </p>

        </section>

      ) : (

        <>

          <section className="insight-card">

            <div className="insight-icon">
              <Sparkles size={22} />
            </div>


            <div>

              <p className="card-label">
                YOUR CURRENT DATA
              </p>

              <h2>
                Your cycle story is taking shape.
              </h2>

              <p>
                Based on your recorded check-ins,
                CycleSync is beginning to identify
                patterns in how you feel over time.
              </p>

            </div>

          </section>


          <section className="dashboard-grid">

            <div
              className="card"
              style={{ padding: "30px" }}
            >

              <p className="card-label">
                CHECK-INS
              </p>

              <h2
                style={{
                  fontSize: "34px",
                  marginTop: "8px",
                }}
              >
                {data.data.check_ins}
              </h2>

              <p
                style={{
                  marginTop: "8px",
                  color: "#7b7180",
                }}
              >
                Days recorded
              </p>

            </div>


            <div
              className="card"
              style={{ padding: "30px" }}
            >

              <p className="card-label">
                AVERAGE ENERGY
              </p>

              <h2
                style={{
                  fontSize: "34px",
                  marginTop: "8px",
                }}
              >
                {data.data.average_energy}/5
              </h2>

              <p
                style={{
                  marginTop: "8px",
                  color: "#7b7180",
                }}
              >
                Across your check-ins
              </p>

            </div>


            <div
              className="card"
              style={{ padding: "30px" }}
            >

              <p className="card-label">
                AVERAGE MOOD
              </p>

              <h2
                style={{
                  fontSize: "34px",
                  marginTop: "8px",
                }}
              >
                {data.data.average_mood}/5
              </h2>

              <p
                style={{
                  marginTop: "8px",
                  color: "#7b7180",
                }}
              >
                Across your check-ins
              </p>

            </div>


            <div
              className="card"
              style={{ padding: "30px" }}
            >

              <p className="card-label">
                AVERAGE PAIN
              </p>

              <h2
                style={{
                  fontSize: "34px",
                  marginTop: "8px",
                }}
              >
                {data.data.average_pain}/5
              </h2>

              <p
                style={{
                  marginTop: "8px",
                  color: "#7b7180",
                }}
              >
                Across your check-ins
              </p>

            </div>

          </section>

        </>

      )}

    </main>
  );
}


export default Fingerprint;