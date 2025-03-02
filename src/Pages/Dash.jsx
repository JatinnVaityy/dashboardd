import { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import axios from "axios"; // Import Axios
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaHeartbeat, FaTemperatureHigh, FaLungs } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dash = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      { label: "Heart Rate (bpm)", data: [], borderColor: "#FF4D4D", backgroundColor: "rgba(255, 77, 77, 0.2)", borderWidth: 2 },
      { label: "Temperature (°C)", data: [], borderColor: "#007BFF", backgroundColor: "rgba(0, 123, 255, 0.2)", borderWidth: 2 },
      { label: "SpO2 (%)", data: [], borderColor: "#28A745", backgroundColor: "rgba(40, 167, 69, 0.2)", borderWidth: 2 },
    ],
  });

  const [healthData, setHealthData] = useState({ heart_rate: "--", temperature: "--", spo2: "--" });
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch real sensor data from Flask backend
        const response = await axios.get("https://backend-kf44.onrender.com/get-health-data");

        const data = response.data;
        setHealthData(data); // Update health metrics

        // Update chart data
        setChartData((prevData) => {
          const newLabels = [...prevData.labels, new Date().toLocaleTimeString()].slice(-10);
          const newDatasets = prevData.datasets.map((dataset, i) => ({
            ...dataset,
            data: [
              ...dataset.data,
              i === 0 ? data.heart_rate : i === 1 ? data.temperature : data.spo2,
            ].slice(-10),
          }));
          return { labels: newLabels, datasets: newDatasets };
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setHealthData({ heart_rate: "--", temperature: "--", spo2: "--" });
      }
    };

    fetchData(); // Initial fetch
    intervalRef.current = setInterval(fetchData, 5000); // Fetch every 5s

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleDownload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const link = document.createElement("a");
      link.href = "/your-pdf-file.pdf"; // Replace with actual PDF path
      link.download = "Health_Insights.pdf"; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 5000);
  };

  return (
    <div style={styles.dashboard}>
      <motion.div
        style={styles.chartContainer}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: "top" } },
            scales: {
              x: { title: { display: true, text: "Time", color: "#666" } },
              y: { title: { display: true, text: "Value", color: "#666" } },
            },
          }}
        />
      </motion.div>

      <div style={styles.metrics}>
        {[
          { icon: <FaHeartbeat />, title: "Heart Rate", value: `${healthData.heart_rate} bpm`, color: "#ff4d4d" },
          { icon: <FaTemperatureHigh />, title: "Body Temperature", value: `${(healthData.temperature / 1.6).toFixed(1)} °C`, color: "#007bff" },
          { icon: <FaLungs />, title: "SpO2", value: `${healthData.spo2} %`, color: "#28a745" },
        ].map((metric, index) => (
          <motion.div
            key={index}
            style={{ ...styles.card, borderLeft: `5px solid ${metric.color}`, color: metric.color }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
          >
            <div style={styles.icon}>{metric.icon}</div>
            <h4>{metric.title}</h4>
            <p>{metric.value}</p>
          </motion.div>
        ))}
      </div>

     
    </div>
  );
};

const styles = {
  dashboard: {
    fontFamily: "Rubik",
    textAlign: "center",
    height: "80vh",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  chartContainer: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    width: "90%",
    height: "70vh",
  },
  metrics: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    padding: "15px",
    width: "190px",
    height: "100px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    transition: "transform 0.3s ease-in-out",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "600",
    fontSize: "16px",
  },
  icon: {
    fontSize: "30px",
    marginBottom: "5px",
  },
  button: {
    marginTop: "20px",
    padding: "5px 10px",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#007BFF",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s",
    outline: "none",
    width: "200px",
  },
};

export default Dash;
