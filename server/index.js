const express = require('express');
const app = express();
const cors = require("cors");
const pool = require("./db");


app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/test', (req, res) => {
    res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});