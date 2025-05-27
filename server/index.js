
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
  axios.get('https://seller.wildberries.ru/ns/statistics-api/api/v1/supplier/sales', {
    headers: { Authorization: token }
  }),
  axios.get('https://seller.wildberries.ru/ns/statistics-api/api/v1/supplier/stocks', {
    headers: { Authorization: token }
  }),
  axios.get('https://seller.wildberries.ru/ns/suppliers-api/api/v3/orders', {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend запущен на порту ${PORT}`));