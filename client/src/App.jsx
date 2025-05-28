import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

function App() {
  const [token, setToken] = useState('');
  const [salesData, setSalesData] = useState([]);
  const chartRef = useRef(null);

  const fetchData = async () => {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    setSalesData(data.sales || []);
  };

  useEffect(() => {
    if (salesData.length === 0 || !chartRef.current) return;

<<<<<<< HEAD
    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: 'Продажи по дням',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: salesData.map(item => item.date),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Продажи',
          type: 'line',
          areaStyle: {},
          data: salesData.map(item => item.count),
          smooth: true,
        },
      ],
    };
=======
  // 📊 Группируем по дате
  const salesByDate = sales
  .filter((item) => item.doc_type_name === "Продажа")
  .reduce((acc, item) => {
    const date = item.rr_dt || (item.sale_dt ? item.sale_dt.slice(0, 10) : null);
    if (!date) return acc;
    acc[date] = (acc[date] || 0) + (item.quantity || 1);
    return acc;
  }, {});
>>>>>>> 2e7a5ee (WIP: временные изменения)

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [salesData]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Wildberries Dashboard</h1>
      <input
        type="text"
        placeholder="Введите токен"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: '80%', marginRight: 10 }}
      />
      <button onClick={fetchData}>Получить данные</button>
      <div
        ref={chartRef}
        style={{ width: '100%', height: '400px', marginTop: '30px' }}
      />
    </div>
  );
}

export default App;
