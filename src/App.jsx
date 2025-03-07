import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import {
  FaBars,
  FaTachometerAlt,
  FaPills,
  FaMapMarkerAlt,
  FaStethoscope,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";
import styled from "styled-components";

// Import Pages
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Dashboard from "./Pages/Dash";
import PillReminder from "./Pages/Pill";
import GPSMap from "./Pages/Gps";
import SymptomChecker from "./Pages/Symp";
import Profile from "./Pages/Profile";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Listen for authentication state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) navigate("/signin");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/signin");
  };

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/pill-reminder", label: "Pill Reminder", icon: <FaPills /> },
    { path: "/gps-location", label: "GPS Location", icon: <FaMapMarkerAlt /> },
    { path: "/symptom-checker", label: "Symptom Checker", icon: <FaStethoscope /> },
    { path: "/profile", label: "Profile", icon: <FaUser /> },
  ];

  if (!user) {
    return (
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    );
  }

  return (
    <Container>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen}>
        <Logo>LiveWell</Logo>
        <UserEmail>{user?.email}</UserEmail>
        <Nav>
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              isActive={location.pathname === item.path}
              onClick={() => setSidebarOpen(false)} // Close sidebar on click
            >
              {item.icon} {item.label}
            </NavItem>
          ))}
        </Nav>
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </LogoutButton>
      </Sidebar>

      <Main>
        <MobileHeader>
          <MenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </MenuButton>
        </MobileHeader>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pill-reminder" element={<PillReminder />} />
          <Route path="/gps-location" element={<GPSMap />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Main>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  font-family: "Rubik", sans-serif;
  background-color: #f5f7fa;
`;

const Sidebar = styled.aside`
  width: ${({ isOpen }) => (isOpen ? "250px" : "60px")};
  background-color: #4a90e2;
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease-in-out;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);

  @media (min-width: 1024px) {
    width: 250px;  /* Fixed width for large screens */
  }

  @media (max-width: 768px) {
    position: absolute;
    height: 100%;
    z-index: 100;
    left: ${({ isOpen }) => (isOpen ? "0" : "-100%")};
    transition: left 0.3s ease-in-out;
  }
`;

const Logo = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: white;
  text-align: center;
`;

const UserEmail = styled.p`
  font-size: 14px;
  color: white;
  text-align: center;
  margin-bottom: 20px;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  font-size: 18px;
  color: ${({ isActive }) => (isActive ? "#4A90E2" : "white")};
  background-color: ${({ isActive }) => (isActive ? "white" : "transparent")};
  text-decoration: none;
  border-radius: 8px;
  transition: 0.3s;

  &:hover {
    background-color: white;
    color: #4a90e2;
  }
`;

const LogoutButton = styled.button`
  margin-top: auto;
  padding: 10px;
  font-size: 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: #c0392b;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  width: 100%;
`;

const MobileHeader = styled.div`
  display: none;
  padding: 10px;
  background-color: #4a90e2;
  color: white;
  text-align: left;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MenuButton = styled.button`
  font-size: 24px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
`;

export default App;
