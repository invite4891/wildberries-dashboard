const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

app.post("/api/data", async (req, res) => {
  const { token } = req.body;

  try {
    const now = new Date();
    const monthAgo = new Date();
    monthAgo.setDate(now.getDate() - 30);

    const dateFrom = monthAgo.toISOString().split("T")[0];
    const dateTo = now.toISOString().split("T")[0];

    const response = await axios.post(
      "https://suppliers-api.wildberries.ru/api/v1/supplier/report/detail-by-period",
      {
        dateFrom,
        dateTo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Ошибка API:", error.message);
    if (error.response) {
      res.status(error.response.status).json({
        error: "Ошибка API",
        details: error.response.data,
      });
    } else {
      res.status(500).json({
        error: "Ошибка API",
        details: error.message,
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend запущен на порту ${PORT}`);
});