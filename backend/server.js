// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// const path = require("path");

// app.use(cors({ 
//     origin: 'https://url-short-r7mu.onrender.com',
//   //  origin: 'http://localhost:5173',
// })); 

// app.use(express.json());

// app.use('/api/links', require('./routes/links'));

// // 👉 SERVE FRONTEND FIRST
// app.use(express.static(path.join(__dirname, 'dist')));

// // 👉 CUSTOM FRONTEND ROUTES
// app.get('/r/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// // 👉 REACT SPA CATCH-ALL MUST BE LAST
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// module.exports = app;




const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const path = require("path");

// app.use(cors({ 
//     origin: 'https://url-short-r7mu.onrender.com',
//   //  origin: 'http://localhost:5173',
// })); 
app.use(cors({ origin: "*" }));

app.use(express.json());

// 1️⃣ API ROUTES FIRST
app.use('/api/links', require('./routes/links'));

// 2️⃣ SERVE FRONTEND BUILD — MUST COME BEFORE ANY CUSTOM ROUTE
app.use(express.static(path.join(__dirname, 'dist')));

// 3️⃣ CUSTOM FRONTEND ROUTES — LIKE /r/:code
app.get('/r/:code', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 4️⃣ SPA CATCH-ALL — SERVES React FOR ALL OTHER ROUTES
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;