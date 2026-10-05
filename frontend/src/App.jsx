import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  CalendarDays,
  Settings2,
  ClipboardCheck,
  Fingerprint,
  Sparkles,
  LogOut,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import MyCycle from "./pages/MyCycle";
import CycleSetup from "./pages/CycleSetup";
import CheckIn from "./pages/CheckIn";
import FingerprintPage from "./pages/Fingerprint";
import Patterns from "./pages/Patterns";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";

import "./App.css";


function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    {
      path: "/",
      label: "Dashboard",
      shortLabel: "Home",
      icon: LayoutDashboard,
    },
    {
      path: "/cycle",
      label: "My Cycle",
      shortLabel: "Cycle",
      icon: CalendarDays,
    },
    {
      path: "/cycle-setup",
      label: "Cycle Setup",
      shortLabel: "Setup",
      icon: Settings2,
    },
    {
      path: "/check-in",
      label: "Check-In",
      shortLabel: "Check-In",
      icon: ClipboardCheck,
    },
    {
      path: "/fingerprint",
      label: "Fingerprint",
      shortLabel: "Pattern",
      icon: Fingerprint,
    },
    {
      path: "/patterns",
      label: "Patterns",
      shortLabel: "Insights",
      icon: Sparkles,
    },
  ];

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  const handleLogout = () => {
    localStorage.removeItem("cyclesync_token");
    localStorage.removeItem("cyclesync_user");

    navigate("/login");
  };

  return (
    <div className="app">

      {/* =================================================
          DESKTOP / APP NAVIGATION
      ================================================= */}

      {!isAuthPage && (
        <nav className="navbar">

          <NavLink
            to="/"
            className="logo"
          >
            CycleSync
            <span className="logo-flower">
              🌸
            </span>
          </NavLink>


          <div className="nav-links">

            {navigation.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <Icon size={16} />

                  <span>
                    {item.label}
                  </span>
                </NavLink>
              );

            })}

          </div>


          {/* LOGOUT */}

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
            aria-label="Log out"
          >
            <LogOut size={16} />

            <span>
              Log out
            </span>
          </button>

        </nav>
      )}


      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* PROTECTED ROUTES */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/cycle"
            element={<MyCycle />}
          />

          <Route
            path="/cycle-setup"
            element={<CycleSetup />}
          />

          <Route
            path="/check-in"
            element={<CheckIn />}
          />

          <Route
            path="/fingerprint"
            element={<FingerprintPage />}
          />

          <Route
            path="/patterns"
            element={<Patterns />}
          />

        </Route>

      </Routes>


      {/* =================================================
          MOBILE BOTTOM NAVIGATION
      ================================================= */}

      {!isAuthPage && (
        <nav className="mobile-bottom-nav">

          {navigation.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "mobile-nav-item active"
                    : "mobile-nav-item"
                }
              >

                <Icon size={20} />

                <span>
                  {item.shortLabel}
                </span>

              </NavLink>
            );

          })}

        </nav>
      )}

    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}


export default App;