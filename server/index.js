const express = require('express');
const path = require('path');
const { toRoman } = require('./roman');
const app = express();
const PORT = process.env.PORT || 8080;

// Minimal logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.url} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

// API endpoint
app.get('/romannumeral', (req, res) => {
  const n = parseInt(req.query.query, 10);
  if (!n || n < 1 || n > 3999) return res.status(400).send('Number must be 1-3999');
  res.json({ input: n.toString(), output: toRoman(n) });
});

// Serve React build
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); 