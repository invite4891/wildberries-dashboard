import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function App() {
  const [token, setToken] = useState("");
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setError("");
    try {
      const response = await fetch("https://c5e3-195-58-50-125.ngrok-free.app/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Unknown error");
      }

      const data = await response.json();

      const grouped = {};

      data.sales.forEach((item) => {
        const date = item.rr_dt || item.date || item.sale_dt?.split("T")[0];
        if (!date) return;

        if (!grouped[date]) {
          grouped[date] = 0;
        }

        grouped[date] += item.quantity || 1;
      });

      const labels = Object.keys(grouped).sort();
      const dataset = labels.map((date) => grouped[date]);

      setChartData({
        labels,
        datasets: [
          {
            label: "Продажи (шт)",
            data: dataset,
            borderColor: "blue",
            tension: 0.4,
          },
        ],
      });
    } catch (err) {
      setError("Ошибка при получении данных. Проверьте токен или API.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>📦 Wildberries Dashboard</h2>
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Введите токен"
        style={{ width: "80%" }}
      />
      <br />
      <button onClick={fetchData}>Получить данные</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {chartData && <Line data={chartData} />}
    </div>
  );
}

export default App;