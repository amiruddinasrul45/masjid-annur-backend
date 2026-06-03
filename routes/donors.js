const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET semua donors dengan history (publik)
router.get('/', async (req, res) => {
  try {
    const [donors] = await db.query('SELECT * FROM donors ORDER BY name ASC');
    for (let donor of donors) {
      const [history] = await db.query(
        'SELECT * FROM donation_records WHERE donor_id = ? ORDER BY date DESC',
        [donor.id]
      );
      donor.history = history;
    }
    res.json(donors);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET donor by id (publik)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM donors WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Donor tidak ditemukan' });
    const donor = rows[0];
    const [history] = await db.query(
      'SELECT * FROM donation_records WHERE donor_id = ? ORDER BY date DESC',
      [donor.id]
    );
    donor.history = history;
    res.json(donor);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH update info donor (butuh login)
router.patch('/:id', requireAuth, async (req, res) => {
  const { name, phone, alamat, type } = req.body;
  try {
    const fields = [];
    const values = [];
    if (name !== undefined)   { fields.push('name = ?');   values.push(name); }
    if (phone !== undefined)  { fields.push('phone = ?');  values.push(phone); }
    if (alamat !== undefined) { fields.push('alamat = ?'); values.push(alamat); }
    if (type !== undefined)   { fields.push('type = ?');   values.push(type); }
    if (!fields.length) return res.status(400).json({ error: 'Tidak ada field yang diupdate.' });
    values.push(req.params.id);
    await db.query(`UPDATE donors SET ${fields.join(', ')} WHERE id = ?`, values);
    res.json({ message: 'Data donatur diupdate' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
