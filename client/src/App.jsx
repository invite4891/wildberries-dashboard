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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("https://c5e3-195-58-50-125.ngrok-free.app/api/data", {
        token: token.trim(),
      });
      if (response.data && response.data.sales) {
        setSales(response.data.sales);
      } else {
        setError("Пустой ответ от сервера.");
      }
    } catch (err) {
      setError("Ошибка при получении данных: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Wildberries Статистика продаж</h1>
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Введите API токен"
        style={{ width: "400px", padding: "10px", fontSize: "16px" }}
      />
      <button onClick={fetchData} style={{ padding: "10px 20px", marginLeft: "10px" }}>
        Получить данные
      </button>

      {loading && <p>Загрузка данных...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {sales.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>График продаж по дням</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={sales}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default App;
