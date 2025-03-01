import { useState, useEffect } from "react";

export default function HealthDashboard() {
  const [fallData, setFallData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  const mockFallData = {
    fallDetected: false,
    timestamp: "2025-03-01 10:15 AM",
  };

  const mockHealthData = {
    heartRate: 110,
    spo2: 95,
    temperature: 36.8,
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const fallResponse = await fetch("http://127.0.0.1:5000/fall-detection");
        if (!fallResponse.ok) throw new Error("Fall API failed");
        const fallData = await fallResponse.json();
        setFallData(fallData);

        const healthResponse = await fetch("http://127.0.0.1:5000/health-data");
        if (!healthResponse.ok) throw new Error("Health API failed");
        const healthData = await healthResponse.json();
        setHealthData(healthData);

        checkAlerts(fallData, healthData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setFallData(mockFallData);
        setHealthData(mockHealthData);
        checkAlerts(mockFallData, mockHealthData);
        setError("Using mock data due to API failure.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  function checkAlerts(fallData, healthData) {
    if (fallData.fallDetected) {
      setAlert("⚠ Fall detected! Immediate attention required.");
    } else if (
      healthData.heartRate > 120 ||
      healthData.heartRate < 50 ||
      healthData.spo2 < 90 ||
      healthData.temperature > 38 ||
      healthData.temperature < 35
    ) {
      setAlert("⚠ Health fluctuations detected! Monitor closely.");
    } else {
      setAlert(null);
    }
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "30px", backgroundColor: "#fff", borderRadius: "15px", boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)", fontFamily: "Inter, sans-serif" }}>
      {loading && <p style={{ textAlign: "center", color: "#6b7280", fontSize: "18px" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "#dc2626", fontSize: "18px" }}>{error}</p>}

      {alert && (
        <div style={{ padding: "15px", marginBottom: "20px", borderRadius: "10px", backgroundColor: "#fee2e2", borderLeft: "6px solid #dc2626", color: "#b91c1c", fontWeight: "700", fontSize: "18px", textAlign: "center" }}>
          {alert}
        </div>
      )}

      {fallData && healthData && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "25px", borderRadius: "12px", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", marginBottom: "30px" }}>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e40af" }}>Health Status</h2>
              <div style={{ fontSize: "18px", color: "#374151" }}>
                <div>Heart Rate: <span style={{ fontWeight: "bold", color: healthData.heartRate > 120 || healthData.heartRate < 50 ? "#dc2626" : "#1e40af" }}>{healthData.heartRate}</span></div>
                <div>SPO2: <span style={{ fontWeight: "bold", color: healthData.spo2 < 90 ? "#dc2626" : "#1e40af" }}>{healthData.spo2}%</span></div>
                <div>Body Temperature: <span style={{ fontWeight: "bold", color: healthData.temperature > 38 || healthData.temperature < 35 ? "#dc2626" : "#1e40af" }}>{healthData.temperature}°C</span></div>
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: "16px", color: "#6b7280" }}>
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Time: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>

          {fallData.fallDetected && (
            <div style={{ padding: "20px", borderRadius: "12px", backgroundColor: "#fee2e2", borderLeft: "6px solid #dc2626" }}>
              <p style={{ fontWeight: "700", color: "#b91c1c", fontSize: "18px" }}>⚠ Fall Alert detected!</p>
              <p style={{ fontSize: "16px", color: "#6b7280" }}>{fallData.timestamp}</p>
              <p style={{ fontSize: "16px", color: "#6b7280" }}>{fallData.details}</p>
            </div>
          )}

          {!fallData.fallDetected && !alert && (
            <div style={{ padding: "15px", borderRadius: "10px", backgroundColor: "#d1fae5", borderLeft: "6px solid #047857", textAlign: "center", fontSize: "18px", fontWeight: "700", color: "#047857" }}>
              ✅ Everything is fine. No worries!
            </div>
          )}
        </>
      )}
    </div>
  );
}
