const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

app.post('/api/data', async (req, res) => {
  const { token, useRevenue } = req.body;

  try {
    const response = await axios.get(
      'https://suppliers-api.wildberries.ru/api/v3/supplier/reportDetailByPeriod',
      {
        headers: {
          Authorization: token
        },
        params: {
          dateFrom: '2025-05-01',
          limit: 1000,
          rrdid: 0
        }
      }
    );

    const rawData = response.data.sales;

    const groupedData = rawData.reduce((acc, item) => {
      const date = item.rr_dt;
      const value = useRevenue ? item.ppvz_for_pay : 1;

      acc[date] = (acc[date] || 0) + value;
      return acc;
    }, {});

    const result = Object.entries(groupedData)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({ sales: result });
  } catch (error) {
    console.error('API error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Ошибка API',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend запущен на порту ${PORT}`);
});