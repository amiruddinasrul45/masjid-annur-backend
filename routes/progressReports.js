const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM progress_reports ORDER BY date DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', requireAuth, async (req, res) => {
  const { id, date, category, title, description, photoUrl, reporter, percentageBefore, percentageAfter } = req.body;
  if (!title || !date) return res.status(400).json({ error: 'Judul dan tanggal wajib diisi.' });
  try {
    await db.query(
      `INSERT INTO progress_reports (id, date, category, title, description, photoUrl, reporter, percentageBefore, percentageAfter)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [id, date, category, title, description, photoUrl, reporter, percentageBefore || 0, percentageAfter || 0]
    );
    res.status(201).json({ message: 'Laporan ditambahkan' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id', requireAuth, async (req, res) => {
  const { date, category, title, description, photoUrl, reporter, percentageBefore, percentageAfter } = req.body;
  try {
    await db.query(
      'UPDATE progress_reports SET date=?, category=?, title=?, description=?, photoUrl=?, reporter=?, percentageBefore=?, percentageAfter=? WHERE id=?',
      [date, category, title, description, photoUrl, reporter, percentageBefore, percentageAfter, req.params.id]
    );
    res.json({ message: 'Laporan diupdate' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM progress_reports WHERE id=?', [req.params.id]);
    res.json({ message: 'Laporan dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
