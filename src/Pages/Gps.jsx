import React, { useEffect, useState } from "react";

const GPSMap = () => {
  const [position, setPosition] = useState({ lat:19.0819638, lng:  72.8887764 });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGPSData = async () => {
      console.log("Fetching GPS data...");
      try {
        const response = await fetch("http://192.168.186.32:5000/get-location-data");
        if (!response.ok) throw new Error("Failed to fetch location data");

        const data = await response.json();
        console.log("Received Data:", data);

        if (data.latitude !== undefined && data.longitude !== undefined) {
          console.log("Updating position to:", { lat: data.latitude, lng: data.longitude });
          setPosition({ lat: data.latitude, lng: data.longitude });
          setError(null);
        } else {
          console.warn("Invalid GPS data received:", data);
          setError("Invalid GPS data received, using default location");
        }
      } catch (err) {
        console.error("Error fetching GPS data:", err);
        setError("Error fetching GPS data, using default location");
      }
    };

    fetchGPSData();
    const interval = setInterval(fetchGPSData, 10000);

    return () => {
      console.log("Clearing fetch interval");
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Live GPS Location</h2>

      <iframe
        title="gps-map"
        width="100%"
        height="500"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${position.lng - 0.01},${position.lat - 0.01},${position.lng + 0.01},${position.lat + 0.01}&layer=mapnik&marker=${position.lat},${position.lng}`}
        style={{ border: "1px solid black" }}
      ></iframe>
      <p><strong>Latitude:</strong> {position.lat}</p>
      <p><strong>Longitude:</strong> {position.lng}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GPSMap;
