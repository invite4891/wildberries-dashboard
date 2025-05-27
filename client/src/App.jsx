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
  Legend,
} from "recharts";

function App() {
  const [token, setToken] = useState("");
  const [sales, setSales] = useState([]);
  const [error, setError] = useState("");
  const [showRevenue, setShowRevenue] = useState(false);

  const fetchData = async () => {
    try {
      setError("");
      const response = await axios.post(
        "https://c5e3-195-58-50-125.ngrok-free.app/api/data",
        { token }
      );

      const data = response.data.sales || [];
      console.log("Пример данных:", data.slice(0, 5));
      setSales(data);
    } catch (err) {
      console.error("Ошибка при получении данных:", err);
      setError("Ошибка при получении данных. Проверьте токен или API.");
    }
  };

  // Группировка продаж по дате
  const salesByDate = {};

  sales.forEach((sale) => {
    const date = sale.date?.split("T")[0];
    if (!date) return;

    if (!salesByDate[date]) {
      salesByDate[date] = { quantity: 0, revenue: 0 };
    }

    salesByDate[date].quantity += 1;
    salesByDate[date].revenue += Number(sale.forPay || 0);
  });

  const chartData = Object.entries(salesByDate).map(([date, values]) => ({
    date,
    quantity: values.quantity,
    revenue: Number(values.revenue.toFixed(2)),
  }));

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>📦 Wildberries Dashboard</h1>

      <input
        type="text"
        placeholder="Введите API токен"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{
          width: "80%",
          padding: "0.5rem",
          fontSize: "1rem",
          marginBottom: "1rem",
        }}
      />
      <br />
      <button onClick={fetchData} style={{ padding: "0.5rem 1.2rem" }}>
        Получить данные
      </button>

      <div style={{ marginTop: "1rem" }}>
        <label>
          <input
            type="checkbox"
            checked={showRevenue}
            onChange={() => setShowRevenue(!showRevenue)}
          />{" "}
          Показать выручку вместо количества
        </label>
      </div>

      {error && (
        <div style={{ marginTop: "1rem", color: "red" }}>
          <strong>{error}</strong>
        </div>
      )}

      {chartData.length > 0 && (
        <>
          <h2 style={{ marginTop: "2rem" }}>
            {showRevenue ? "Выручка по дням (₽)" : "Количество продаж по дням"}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={showRevenue ? "revenue" : "quantity"}
                stroke="#8884d8"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

export default App;