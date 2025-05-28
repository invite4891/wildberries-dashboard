import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import SalesChart from "./components/SalesChart";
import SalesTable from "./components/SalesTable";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/data", {
          token:
            "eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjUwMjE3djEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTc1Nzk4NzU3MCwiaWQiOiIwMTk1YTQ2MC1lZGEzLTcwYTktYWZhMC0wN2IyZmE3YzlhNmIiLCJpaWQiOjcxNjMwMTkzLCJvaWQiOjExOTA0ODMsInMiOjEwNzM3NDk3NTgsInNpZCI6IjZkODZmOWZmLTY4NmQtNDM3Yi1iNjVhLTYxZGFjMjhmYjgwZCIsInQiOmZhbHNlLCJ1aWQiOjcxNjMwMTkzfQ.8DDG7qCPuT5I8j3a5_5WTmOaNZ3X1xMnH-Bz59-YWBatfDbwQIsl6qTTXQuzCmjRx-328oxWjdAkUjLOyces6Q",
        });
        setData(response.data.sales);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);

  const processedSales = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    const filtered = data.filter(
      (item) => item.supplier_oper_name === "Продажа" && item.rr_dt
    );

    const grouped = filtered.reduce((acc, item) => {
      const date = item.rr_dt;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  }, [data]);

  return (
    <div className="App">
      <h1>Аналитика продаж</h1>
      <SalesChart data={processedSales} />
      <SalesTable rows={processedSales} />
    </div>
  );
}

export default App;
