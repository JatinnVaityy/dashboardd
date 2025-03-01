import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

// Import your pages
import Dashboard from "./Pages/Dash";
import PillReminder from "./Pages/Pill";
import GPSMap from "./Pages/Gps";
import SymptomChecker from "./Pages/Symp";
import Alerts from "./Pages/Alerts";
import Profile from "./Pages/Profile";

const App = () => {
  const location = useLocation(); // Get the current path

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>LiveWell</h2>
        <Link
          to="/"
          style={location.pathname === "/" ? styles.menuItemActive : styles.menuItem}
        >
          📊 Dashboard
        </Link>
        <Link
          to="/pill-reminder"
          style={location.pathname === "/pill-reminder" ? styles.menuItemActive : styles.menuItem}
        >
          💊 Pill Reminder
        </Link>
        <Link
          to="/gps-location"
          style={location.pathname === "/gps-location" ? styles.menuItemActive : styles.menuItem}
        >
          📍 GPS Location
        </Link>
        <Link
          to="/symptom-checker"
          style={location.pathname === "/symptom-checker" ? styles.menuItemActive : styles.menuItem}
        >
          🩺 Symptom Checker
        </Link>
        <Link
          to="/alerts"
          style={location.pathname === "/alerts" ? styles.menuItemActive : styles.menuItem}
        >
          🔔 Alerts
        </Link>
        <Link
          to="/profile"
          style={location.pathname === "/profile" ? styles.menuItemActive : styles.menuItem}
        >
          👤 Profile
        </Link>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pill-reminder" element={<PillReminder />} />
          <Route path="/gps-location" element={<GPSMap />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" },
  sidebar: { width: "250px", backgroundColor: "#1890FF", padding: "20px", display: "flex", flexDirection: "column", gap: "15px" },
  logo: { fontSize: "22px", fontWeight: "bold", marginBottom: "20px", color: "white" },
  menuItem: { padding: "10px", cursor: "pointer", textDecoration: "none", color: "white", borderRadius: "5px" },
  menuItemActive: { padding: "10px", backgroundColor: "white", color: "#1E90FF", fontWeight: "bold", borderRadius: "5px", textDecoration: "none" },
  mainContent: { flex: 1, padding: "20px", backgroundColor: "#F5F7FA" },
};

export default App;
