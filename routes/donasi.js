const express = require('express');
const router = express.Router();
const db = require('../db');

// GET semua donasi
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT dr.*, d.name as donorName 
       FROM donation_records dr 
       LEFT JOIN donors d ON dr.donor_id = d.id 
       ORDER BY dr.date DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET total terkumpul
router.get('/total', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT SUM(amount) as total FROM donation_records WHERE status = "sukses"'
    );
    res.json({ total: rows[0].total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST tambah donasi baru
router.post('/', async (req, res) => {
  const { nama, jumlah } = req.body;
  const id = 'don_' + Date.now();
  const invoiceNumber = 'INV/WEB/' + Date.now();
  try {
    let donorId = 'anon_' + Date.now();
    const [existing] = await db.query(
      'SELECT id FROM donors WHERE name = ?', [nama]
    );

    if (existing.length > 0) {
      donorId = existing[0].id;
    } else {
      await db.query(
        `INSERT INTO donors (id, name, type, status, totalContribution, avatar) 
         VALUES (?, ?, 'one-time', 'inactive', ?, '')`,
        [donorId, nama, jumlah]
      );
    }

    await db.query(
      `INSERT INTO donation_records 
       (id, donor_id, amount, date, type, description, invoiceNumber, status)
       VALUES (?, ?, ?, CURDATE(), 'one-time', 'Donasi via Web', ?, 'sukses')`,
      [id, donorId, jumlah, invoiceNumber]
    );

    await db.query(
      'UPDATE donors SET totalContribution = totalContribution + ? WHERE id = ?',
      [jumlah, donorId]
    );

    res.status(201).json({ message: 'Donasi berhasil disimpan', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;