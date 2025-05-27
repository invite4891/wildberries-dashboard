import React, { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [token, setToken] = useState("");
  const [sales, setSales] = useState([]);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setError("");
      const response = await axios.post("https://1c2d-195-58-50-125.ngrok-free.app/api/data", {
        token,
      });
      setSales(response.data.sales || []);
    } catch (err) {
      console.error(err);
      setError("Ошибка при получении данных. Проверьте токен или API.");
    }
  };

  const salesByDate = sales.reduce((acc, sale) => {
    const rawDate = sale.date || sale.dateAndTime;
    if (!rawDate) return acc;

    const date = rawDate.split("T")[0]; // Берём только дату
    const quantity = sale.quantity || sale.retailQuantity || 0;

    if (!acc[date]) {
      acc[date] = quantity;
    } else {
      acc[date] += quantity;
    }

    return acc;
  }, {});

  const chartData = Object.entries(salesByDate).map(([date, quantity]) => ({
    date,
    quantity,
  }));

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>📊 Wildberries Dashboard</h1>

      <input
        type="text"
        placeholder="Введите API токен"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: "80%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      <br />
      <button onClick={fetchData} style={{ padding: "0.5rem 1rem" }}>
        Получить данные
      </button>

      {error && (
        <div style={{ marginTop: "1rem", color: "red" }}>
          <strong>{error}</strong>
        </div>
      )}

      {chartData.length > 0 && (
        <>
          <h2 style={{ marginTop: "2rem" }}>Продажи (по дате)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

export default App;