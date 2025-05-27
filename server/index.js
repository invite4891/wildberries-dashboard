
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/data', async (req, res) => {
  const { token } = req.body;

  try {
    const [sales, stocks, orders] = await Promise.all([
      axios.get('https://statistics-api.wildberries.ru/api/v1/supplier/sales', {
        headers: { Authorization: token }
      }),
      axios.get('https://statistics-api.wildberries.ru/api/v1/supplier/stocks', {
        headers: { Authorization: token }
      }),
      axios.get('https://suppliers-api.wildberries.ru/api/v3/orders', {
        headers: { Authorization: token }
      }),
    ]);

    res.json({
      sales: sales.data,
      stocks: stocks.data,
      orders: orders.data
    });
  } catch (err) {
    res.status(400).json({ error: 'Ошибка API', details: err.message });
  }
});

app.listen(5000, () => console.log('Backend запущен на http://localhost:5000'));
