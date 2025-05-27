
import React, { useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function App() {
  const [token, setToken] = useState("");
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const response = await axios.post("https://wildberries-dashboard.onrender.com", { token });
    setData(response.data);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-4">Wildberries Dashboard</h1>
      <input
        className="border p-2 rounded w-full"
        placeholder="Введите API-ключ"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button
        onClick={fetchData}
        className="mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
      >
        Получить данные
      </button>

      {data && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Продажи</h2>
          <BarChart width={600} height={300} data={data.sales.slice(0, 10)}>
            <XAxis dataKey="realizationdate" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="price" />
          </BarChart>

          <h2 className="text-xl font-semibold mt-6">Остатки</h2>
          <p>Всего товаров: {data.stocks.length}</p>

          <h2 className="text-xl font-semibold mt-6">Заказы</h2>
          <p>Текущих заказов: {data.orders.length}</p>
        </div>
      )}
    </div>
  );
}
