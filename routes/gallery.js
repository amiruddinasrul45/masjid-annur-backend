const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM gallery ORDER BY date DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  const { id, date, title, description, imageUrl, category } = req.body;
  try {
    await db.query(`INSERT INTO gallery VALUES (?,?,?,?,?,?)`,
      [id, date, title, description, imageUrl, category]);
    res.status(201).json({ message: 'Galeri ditambahkan' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;