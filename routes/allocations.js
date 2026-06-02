const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM allocations');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  const { id, item, estimatedCost, actualSpent, category, status } = req.body;
  try {
    await db.query(`INSERT INTO allocations VALUES (?,?,?,?,?,?)`,
      [id, item, estimatedCost, actualSpent, category, status]);
    res.status(201).json({ message: 'Alokasi ditambahkan' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;