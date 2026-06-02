const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

app.use('/api/donasi',        require('./routes/donasi'));
app.use('/api/proposals',     require('./routes/proposals'));
app.use('/api/allocations',   require('./routes/allocations'));
app.use('/api/disbursements', require('./routes/disbursements'));
app.use('/api/progress',      require('./routes/progressReports'));
app.use('/api/gallery',       require('./routes/gallery'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.json({ message: 'Backend Masjid An-Nur berjalan!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server jalan di http://localhost:${PORT}`));