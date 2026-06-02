const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM progress_reports ORDER BY date DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  const { id, date, category, title, description, photoUrl, reporter, percentageBefore, percentageAfter } = req.body;
  try {
    await db.query(`INSERT INTO progress_reports VALUES (?,?,?,?,?,?,?,?,?)`,
      [id, date, category, title, description, photoUrl, reporter, percentageBefore, percentageAfter]);
    res.status(201).json({ message: 'Laporan ditambahkan' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;