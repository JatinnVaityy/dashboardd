import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaPills, FaMapMarkerAlt, FaStethoscope, FaBell, FaUser } from "react-icons/fa";

// Import your pages
import Dashboard from "./Pages/Dash";
import PillReminder from "./Pages/Pill";
import GPSMap from "./Pages/Gps";
import SymptomChecker from "./Pages/Symp";
import Alerts from "./Pages/Alerts";
import Profile from "./Pages/Profile";

const App = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/pill-reminder", label: "Pill Reminder", icon: <FaPills /> },
    { path: "/gps-location", label: "GPS Location", icon: <FaMapMarkerAlt /> },
    { path: "/symptom-checker", label: "Symptom Checker", icon: <FaStethoscope /> },
    { path: "/profile", label: "Profile", icon: <FaUser /> },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>LiveWell</h2>
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={location.pathname === item.path ? styles.menuItemActive : styles.menuItem}
            >
              <span style={styles.icon}>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pill-reminder" element={<PillReminder />} />
          <Route path="/gps-location" element={<GPSMap />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Rubik', sans-serif",
    backgroundColor: "#F5F7FA",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#4A90E2",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
  },
  logo: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "white",
    textAlign: "center",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    fontSize: "18px",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    transition: "background 0.3s",
  },
  menuItemActive: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    fontSize: "18px",
    backgroundColor: "white",
    color: "#4A90E2",
    fontWeight: "bold",
    borderRadius: "8px",
    textDecoration: "none",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  menuItemHover: {
    backgroundColor: "#76B5FF",
  },
  icon: {
    fontSize: "22px",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  },
};

export default App;
