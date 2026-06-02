const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/donasi',        require('./routes/donasi'));
app.use('/api/proposals',     require('./routes/proposals'));
app.use('/api/allocations',   require('./routes/allocations'));
app.use('/api/disbursements', require('./routes/disbursements'));
app.use('/api/progress',      require('./routes/progressReports'));
app.use('/api/gallery',       require('./routes/gallery'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/rab',           require('./routes/rab'));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Masjid An-Nur</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #0f4c35; color: white; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .container { text-align: center; padding: 40px; }
        .icon { font-size: 64px; margin-bottom: 20px; }
        h1 { font-size: 32px; margin-bottom: 10px; }
        p { color: #a7d9c5; margin-bottom: 30px; font-size: 16px; }
        .badge { display: inline-block; background: #27ae60; padding: 6px 16px; border-radius: 20px; font-size: 13px; margin-bottom: 30px; }
        .endpoints { background: rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; text-align: left; max-width: 400px; margin: 0 auto; }
        .endpoints h3 { margin-bottom: 16px; font-size: 14px; color: #a7d9c5; text-transform: uppercase; letter-spacing: 1px; }
        .endpoint { display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 13px; }
        .endpoint:last-child { border-bottom: none; }
        .method { background: #27ae60; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-right: 10px; font-weight: bold; }
        .method.post { background: #e67e22; }
        .footer { margin-top: 30px; font-size: 12px; color: #a7d9c5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">🕌</div>
        <h1>Masjid An-Nur API</h1>
        <p>Sistem Akuntabilitas Pembangunan Masjid An-Nur<br>Perumahan Bumi Daya Indah • Kota Makassar</p>
        <div class="badge">✅ Server Online</div>
        <div class="endpoints">
          <h3>Available Endpoints</h3>
          <div class="endpoint"><span class="method">GET</span> /api/donasi</div>
          <div class="endpoint"><span class="method post">POST</span> /api/donasi</div>
          <div class="endpoint"><span class="method">GET</span> /api/proposals</div>
          <div class="endpoint"><span class="method">GET</span> /api/disbursements</div>
          <div class="endpoint"><span class="method">GET</span> /api/progress</div>
          <div class="endpoint"><span class="method">GET</span> /api/gallery</div>
          <div class="endpoint"><span class="method">GET</span> /api/notifications</div>
          <div class="endpoint"><span class="method post">POST</span> /api/auth/login</div>
          <div class="endpoint"><span class="method">GET</span> /api/rab</div>
        </div>
        <div class="footer">© 2026 Masjid An-Nur • Powered by Express.js</div>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server jalan di http://localhost:${PORT}`));