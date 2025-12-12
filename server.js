const express = require('express');
const path = require('path');
const app = express();

// Serve static files from /public at the root
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve index.html at /
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
  console.log('Fortress web listening on port 3000');
});
