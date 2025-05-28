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
      const response = await axios.post("https://c5e3-195-58-50-125.ngrok-free.app/api/data", {
        token,
      });

      const data = response.data.sales || [];
      console.log("Данные из API:", data.slice(0, 5)); // отладка
      setSales(data);
    } catch (err) {
      console.error("Ошибка при получении данных:", err);
      setError("Ошибка при получении данных. Проверьте токен или API.");
    }
  };

  // 🔍 Фильтруем только записи с положительным количеством
  const filteredSales = sales.filter((sale) => {
    const quantity = Number(sale.quantity || 0);
    return quantity > 0;
  });

  // 📊 Группируем по дате
  const salesByDate = filteredSales.reduce((acc, sale) => {
    const date = sale.sale_dt?.split("T")[0];
    const quantity = Number(sale.quantity || 0);
    if (!date) return acc;

    acc[date] = (acc[date] || 0) + quantity;
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
              <Line
                type="monotone"
                dataKey="quantity"
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
