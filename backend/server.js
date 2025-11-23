const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const path = require("path");

app.use(cors({ 
    origin: 'https://url-short-r7mu.onrender.com',
  //  origin: 'http://localhost:5173',
})); 

app.use(express.json());

app.use('/api/links', require('./routes/links'));

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;