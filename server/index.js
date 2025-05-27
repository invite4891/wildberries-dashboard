// server/index.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/data", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "API-токен не предоставлен." });
  }

  try {
    const dateFrom = "2025-05-01";
    const dateTo = new Date().toISOString().split("T")[0];

    const response = await axios.get(
      `https://statistics-api.wildberries.ru/api/v5/supplier/reportDetailByPeriod`,
      {
        headers: {
          Authorization: token,
        },
        params: {
          dateFrom,
          dateTo,
          rrdid: 0,
        },
      }
    );

    res.json({ sales: response.data });
  } catch (err) {
    console.error("Ошибка запроса к Wildberries API:", err?.response?.data || err.message);
    res.status(500).json({
      error: "Ошибка API",
      details: err?.response?.data || err.message,
    });
  }
});

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Backend запущен на порту ${PORT}`);
});