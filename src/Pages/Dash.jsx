import { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
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
import { Card, CardBody, CardTitle, Spinner } from "reactstrap";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dash = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      { label: "Heart Rate (bpm)", data: [], borderColor: "#FF6B6B", backgroundColor: "rgba(255, 107, 107, 0.2)", borderWidth: 2 },
      { label: "Temperature (°C)", data: [], borderColor: "#1890FF", backgroundColor: "rgba(24, 144, 255, 0.2)", borderWidth: 2 },
      { label: "SpO2 (%)", data: [], borderColor: "#28C76F", backgroundColor: "rgba(40, 199, 111, 0.2)", borderWidth: 2 },
    ],
  });

  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/health-data");
        const data = await response.json();

        console.log("Fetched Health Data:", data); // Log the fetched data

        setChartData((prevData) => {
          const time = [...prevData.labels, new Date().toLocaleTimeString()].slice(-10);

          return {
            labels: time,
            datasets: [
              {
                label: "Heart Rate (bpm)",
                data: [...prevData.datasets[0].data, data.heart_rate].slice(-10),
                borderColor: "#FF6B6B",
                backgroundColor: "rgba(255, 107, 107, 0.2)",
                borderWidth: 2,
              },
              {
                label: "Temperature (°C)",
                data: [...prevData.datasets[1].data, data.temperature].slice(-10),
                borderColor: "#1890FF",
                backgroundColor: "rgba(24, 144, 255, 0.2)",
                borderWidth: 2,
              },
              {
                label: "SpO2 (%)",
                data: [...prevData.datasets[2].data, data.spo2].slice(-10),
                borderColor: "#28C76F",
                backgroundColor: "rgba(40, 199, 111, 0.2)",
                borderWidth: 2,
              },
            ],
          };
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching health data:", error);
        setLoading(false);
      }
    };

    fetchData();
    intervalRef.current = setInterval(fetchData, 5000); // Fetch new data every 5 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows height to increase
    plugins: { legend: { display: true, position: "top" } },
    scales: {
      x: { title: { display: true, text: "Time", color: "#2C3E50" } },
      y: { title: { display: true, text: "Values", color: "#2C3E50" } },
    },
    elements: {
      line: { tension: 0.3 }, // Smooth curves
      point: { radius: 3 },
    },
  };

  return (
    <Card
      className="border-0 shadow p-4 rounded"
      style={{
        background: "#F4F6F9", // Light background for a clean UI
        borderColor: "#1890FF",
        height: "500px",
      }}
    >
      <CardBody
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <CardTitle
          tag="h4"
          className="text-center mb-4"
          style={{ color: "#1890FF", fontWeight: "bold" }}
        >
          Live Health Monitoring 
        </CardTitle>

        {loading ? (
          <div className="text-center">
            <Spinner color="primary" />
            <p className="mt-2" style={{ color: "#2C3E50" }}>Fetching latest health data...</p>
          </div>
        ) : (
          <div style={{ flexGrow: 1, height: "450px" }}> {/* Increased chart height */}
            <Line data={chartData} options={options} />
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default Dash;
