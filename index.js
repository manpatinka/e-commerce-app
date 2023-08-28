const express = require('express');
const app = express();

const PORT = 3000;

app.get('/test', (req, res) => {
    res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});