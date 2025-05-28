import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function App() {
  const [token, setToken] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setError('');
      const response = await fetch('https://c5e3-195-58-50-125.ngrok-free.app/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();
      if (result.error) {
        setError(`Ошибка при получении данных. Проверьте токен или API.`);
        return;
      }

      setSalesData(result.sales);
    } catch (err) {
      console.error(err);
      setError('Ошибка при подключении к серверу.');
    }
  };

  const chartData = {
    labels: salesData.map(item => item.date),
    datasets: [
      {
        label: 'Продажи (по дате)',
        data: salesData.map(item => item.count),
        borderColor: 'blue',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2>📊 Wildberries Статистика продаж</h2>
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: '80%' }}
      />
      <button onClick={fetchData}>Получить данные</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {salesData.length > 0 && (
        <div>
          <h3>График продаж по дням</h3>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
}

export default App;
