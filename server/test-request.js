const https = require('https');

const data = JSON.stringify({
  dateFrom: "2025-05-01",
  dateTo: "2025-05-27"
});

const options = {
  hostname: 'suppliers-api.wildberries.ru',
  path: '/api/v1/supplier/report/detail-by-period',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjUwMjE3djEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTc1Nzk4NzU3MCwiaWQiOiIwMTk1YTQ2MC1lZGEzLTcwYTktYWZhMC0wN2IyZmE3YzlhNmIiLCJpaWQiOjcxNjMwMTkzLCJvaWQiOjExOTA0ODMsInMiOjEwNzM3NDk3NTgsInNpZCI6IjZkODZmOWZmLTY4NmQtNDM3Yi1iNjVhLTYxZGFjMjhmYjgwZCIsInQiOmZhbHNlLCJ1aWQiOjcxNjMwMTkzfQ.8DDG7qCPuT5I8j3a5_5WTmOaNZ3X1xMnH-Bz59-YWBatfDbwQIsl6qTTXQuzCmjRx-328oxWjdAkUjLOyces6Q'
  }
};

const req = https.request(options, res => {
  let responseData = '';

  res.on('data', chunk => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Ответ от API:', responseData);
  });
});

req.on('error', error => {
  console.error('Ошибка запроса:', error.message);
});

req.write(data);
req.end();