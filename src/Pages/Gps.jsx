import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Gps = () => {
  const [hospitals, setHospitals] = useState([]);
  const latitude = 19.7060402;
  const longitude = 72.7819734;

  useEffect(() => {
    fetchNearbyHospitals(latitude, longitude);
  }, []);

  const fetchNearbyHospitals = async (lat, lng) => {
    try {
      console.log("Fetching hospitals for:", lat, lng);
      const query = `[out:json];node[amenity=hospital](around:2000,${lat},${lng});out body;`;
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );

      if (!response.ok) throw new Error(`API Request Failed: ${response.status}`);

      const hospitalData = await response.json();
      console.log("Hospital API Response:", hospitalData);

      if (!hospitalData.elements || hospitalData.elements.length === 0) {
        console.warn("No hospitals found in API response.");
        setHospitals([]);
        return;
      }

      const hospitalList = hospitalData.elements
        .filter((hospital) => hospital.tags && hospital.tags.name)
        .map((hospital) => ({
          name: hospital.tags.name || "Unnamed Hospital",
          lat: hospital.lat,
          lng: hospital.lon,
        }));

      if (hospitalList.length === 0) {
        console.warn("No valid hospitals with names found.");
      }

      setHospitals(hospitalList);
      sendHospitalDataToAPI(hospitalList);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    }
  };

  const sendHospitalDataToAPI = async (hospitals) => {
    if (!hospitals || hospitals.length === 0) {
      console.warn("No hospital data to send.");
      return;
    }

    console.log("Sending hospitals to backend:", hospitals);

    try {
      const response = await fetch("https://livewell-lxau.onrender.com/send_hospitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospitals }),
      });

      if (!response.ok) throw new Error(`Failed to send hospital data: ${response.status}`);

      console.log("Hospital data sent successfully");
    } catch (err) {
      console.error("Error sending hospital data:", err);
    }
  };

  return (
    <div>
      <h1>Fall Detection System</h1>
      <p style={{ color: "red", fontWeight: "bold" }}>🚨 Fall Detected! Fetching hospitals... 🚨</p>

      <MapContainer center={[latitude, longitude]} zoom={14} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Show User's Location */}
        <Marker position={[latitude, longitude]}>
          <Popup>📍 You are here</Popup>
        </Marker>

        {/* Show Nearby Hospitals */}
        {hospitals.map((hospital, index) => (
          <Marker key={index} position={[hospital.lat, hospital.lng]}>
            <Popup>🏥 {hospital.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Gps;
