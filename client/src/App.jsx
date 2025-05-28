import React, { useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [token, setToken] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState("");

const fetchData = async () => {
  try {
    setError("");
    const response = await axios.post("https://c5e3-195-58-50-125.ngrok-free.app/api/data", {
      token,
    });

  const fullData = response.data.sales || [];
const uniqueOps = [...new Set(fullData.map((item) => item.supplier_oper_name))];


 setSalesData(fullData); 


 
  } catch (err) {
    console.error("Ошибка при получении данных:", err);
    setError("Ошибка при получении данных. Проверьте токен или API.");
  }
};

  // 🔍 Фильтруем только записи с положительным количеством
  const filteredSales = salesData.filter((sale) => {
    const quantity = Number(sale.quantity || 0);
    return quantity > 0;
  });

  // 📊 Группируем по дате
  const salesByDate = salesData
  .filter((item) => item.doc_type_name === "Продажа")
  .reduce((acc, item) => {
    const date = item.rr_dt || (item.sale_dt ? item.sale_dt.slice(0, 10) : null);
    if (!date || !item.quantity || item.quantity <= 0) return acc;
    acc[date] = (acc[date] || 0) + item.quantity;
    return acc;
  }, {});
  

// 📦 Заказы по дате — из salesData
const ordersByDate = salesData
  .filter((item) => item.supplier_oper_name === "Логистика" && item.order_dt)
  .reduce((acc, item) => {
    const date = item.order_dt.slice(0, 10);
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

const ordersChartData = Object.entries(ordersByDate).map(([date, quantity]) => ({
  date,
  quantity,
}));
 const chartData = Object.entries(salesByDate).map(([date, quantity]) => ({
  date,
  quantity: Number(quantity),
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

  <AreaChart data={chartData}>
<defs>
  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
  </linearGradient>
</defs>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Area
  type="monotone"
  dataKey="quantity"
  stroke="#8884d8"
  fillOpacity={1}
  fill="url(#colorSales)"
/>
  </AreaChart>
</ResponsiveContainer>
        </>
      )}
      
            {ordersChartData.length > 0 && (
        <>
          <h2 style={{ marginTop: "3rem" }}>📦 Заказы (по дате)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={ordersChartData}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="quantity"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorOrders)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}
      
    </div>
  );
}

export default App;
