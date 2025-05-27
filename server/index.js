const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5050;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/data', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const response = await axios.get(
      'https://statistics-api.wildberries.ru/api/v1/supplier/reportDetailByPeriod',
      {
        headers: {
          Authorization: token,
        },
        params: {
          dateFrom: '2025-05-01',
          limit: 100000,
          rrdid: 0,
        },
      }
    );

    const sales = response.data;

    const realSales = sales.filter((item) => item.quantity > 0);

    const grouped = {};

    realSales.forEach((sale) => {
      const date = sale.rr_dt || sale.sale_dt?.slice(0, 10);
      if (!grouped[date]) {
        grouped[date] = {
          quantity: 0,
          forPay: 0,
        };
      }
      grouped[date].quantity += sale.quantity;
      grouped[date].forPay += sale.ppvz_for_pay;
    });

    const chartData = Object.entries(grouped).map(([date, values]) => ({
      date,
      quantity: values.quantity,
      forPay: values.forPay,
    }));

    res.json({ chartData });
  } catch (error) {
    console.error('API error:', error.message);
    res.status(500).json({ error: 'Ошибка API', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend запущен на порту ${PORT}`);
});