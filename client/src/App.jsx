
import React, { useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function App() {
  const [token, setToken] = useState("");
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.post("https://1c2d-195-58-50-125.ngrok-free.app/api/data", { token });
      setData(response.data);
    } catch (err) {
      alert("Ошибка при получении данных. Проверьте токен или API.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>📊 Wildberries Dashboard</h1>
      <input
        type="text"
        placeholder="Введите API-ключ"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginTop: "1rem" }}
      />
      <button onClick={fetchData} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
        Получить данные
      </button>

      {data && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Продажи (по дате)</h2>
          <BarChart width={600} height={300} data={data.sales.slice(0, 10)}>
            <XAxis dataKey="realizationdate" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="price" fill="#8884d8" />
          </BarChart>
        </div>
      )}
    </div>
  );
}
