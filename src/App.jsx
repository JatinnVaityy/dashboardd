import React from "react";
import { Routes, Route, Link } from "react-router-dom";

// Import your pages
import Dashboard from "./pages/Dashboard";
import PillReminder from "./Pages/Pill";

const App = () => {
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>LiveWell</h2>
        <Link to="/" style={styles.menuItemActive}>📊 Dashboard</Link>
        <Link to="/pill-reminder" style={styles.menuItem}>💊 Pill Reminder</Link>
        <Link to="/gps-location" style={styles.menuItem}>📍 GPS Location</Link>
        <Link to="/symptom-checker" style={styles.menuItem}>🩺 Symptom Checker</Link>
        <Link to="/alerts" style={styles.menuItem}>🔔 Alerts</Link>
        <Link to="/profile" style={styles.menuItem}>👤 Profile</Link>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pill-reminder" element={<PillReminder />} />
        </Routes>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" },
  sidebar: { width: "250px", backgroundColor: "#1E90FF", padding: "20px", display: "flex", flexDirection: "column", gap: "15px" },
  logo: { fontSize: "22px", fontWeight: "bold", marginBottom: "20px", color: "white" },
  menuItem: { padding: "10px", cursor: "pointer", textDecoration: "none", color: "white" },
  menuItemActive: { padding: "10px", backgroundColor: "white", color: "#1E90FF", fontWeight: "bold", borderRadius: "5px", textDecoration: "none" },
  mainContent: { flex: 1, padding: "20px", backgroundColor: "#F5F7FA" },
};

export default App;
