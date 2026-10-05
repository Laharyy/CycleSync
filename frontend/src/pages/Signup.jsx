import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  Flower2,
} from "lucide-react";

import api from "../api";


function Signup() {

  const navigate = useNavigate();


  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");


  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async (event) => {

    event.preventDefault();

    setMessage("");
    setError("");


    if (password !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    if (password.length < 8) {

      setError(
        "Password must be at least 8 characters long."
      );

      return;
    }


    try {

      setLoading(true);


      const response =
        await api.post(
          "/api/auth/signup",
          {
            name,
            email,
            password,
          }
        );


      if (response.data.success) {

        const user =
          response.data.data;


        localStorage.setItem(
          "cyclesync_token",
          user.access_token
        );


        localStorage.setItem(
          "cyclesync_user",
          JSON.stringify({
            user_id: user.user_id,
            name: user.name,
            email: user.email,
          })
        );


        setMessage(
          "Your CycleSync account has been created 🌸"
        );


        setTimeout(() => {

          navigate("/");

        }, 700);

      }


    } catch (error) {

      console.error(
        "Signup error:",
        error
      );


      if (
        error.response?.data?.detail
      ) {

        setError(
          error.response.data.detail
        );

      } else {

        setError(
          "Could not create your account. Please try again."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  return (
    <main className="auth-page">

      <section className="auth-card">


        {/* BRAND */}

        <div className="auth-brand">

          <div className="auth-logo-icon">

            <Flower2 size={22} />

          </div>

          <span>
            CycleSync
          </span>

        </div>


        {/* HEADER */}

        <div className="auth-header">

          <p className="eyebrow">
            YOUR PERSONAL CYCLE SPACE
          </p>

          <h1>
            Create your account
          </h1>

          <p>
            Start building a more personal
            understanding of your cycle,
            one check-in at a time.
          </p>

        </div>


        {/* FORM */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >


          {/* NAME */}

          <div className="form-group">

            <label htmlFor="signup-name">
              Name
            </label>

            <input
              id="signup-name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />

          </div>


          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="signup-email">
              Email
            </label>

            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="signup-password">
              Password
            </label>

            <input
              id="signup-password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              minLength="8"
              required
            />

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label htmlFor="signup-confirm-password">
              Confirm password
            </label>

            <input
              id="signup-confirm-password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              minLength="8"
              required
            />

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={loading}
          >

            {loading
              ? "Creating account..."
              : (
                <>
                  Create Account
                  <ArrowRight size={17} />
                </>
              )}

          </button>


          {/* SUCCESS */}

          {message && (

            <p className="auth-success">
              {message}
            </p>

          )}


          {/* ERROR */}

          {error && (

            <p className="auth-error">
              {error}
            </p>

          )}

        </form>


        {/* LOGIN LINK */}

        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Log in
          </Link>

        </div>


        {/* NOTE */}

        <p className="auth-note">

          Your CycleSync account keeps your
          personal cycle information separate
          from other users.

        </p>


      </section>

    </main>
  );
}


export default Signup;