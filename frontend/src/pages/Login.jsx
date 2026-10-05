import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Flower2 } from "lucide-react";
import api from "../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await api.post(
        "/api/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        const user = response.data.data;

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

        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError(
          "Could not log you in. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">

        <div className="auth-brand">
          <div className="auth-logo-icon">
            <Flower2 size={22} />
          </div>

          <span>
            CycleSync
          </span>
        </div>

        <div className="auth-header">
          <p className="eyebrow">
            WELCOME BACK
          </p>

          <h1>
            Log in to CycleSync
          </h1>

          <p>
            Continue your personal cycle
            wellness journey and keep building
            your unique pattern history.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="login-email">
              Email
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={loading}
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                Log In
                <ArrowRight size={17} />
              </>
            )}
          </button>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}
        </form>

        <div className="auth-footer">
          <span>
            Don't have an account?
          </span>

          <Link to="/signup">
            Create one
          </Link>
        </div>

        <p className="auth-note">
          Your CycleSync account keeps your
          personal cycle information separate
          from other users.
        </p>

      </section>
    </main>
  );
}

export default Login;