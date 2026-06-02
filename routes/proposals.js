const express = require('express');
const router = express.Router();
const db = require('../db');

// GET semua proposals
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM proposals');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST tambah proposal
router.post('/', async (req, res) => {
  const { id, title, description, targetCost, currentCollected, urgency, category, icon, status } = req.body;
  try {
    await db.query(
      `INSERT INTO proposals VALUES (?,?,?,?,?,?,?,?,?)`,
      [id, title, description, targetCost, currentCollected, urgency, category, icon, status]
    );
    res.status(201).json({ message: 'Proposal ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update proposal
router.patch('/:id', async (req, res) => {
  const fields = req.body;
  const sets = Object.keys(fields).map(k => `${k} = ?`).join(', ');
  try {
    await db.query(
      `UPDATE proposals SET ${sets} WHERE id = ?`,
      [...Object.values(fields), req.params.id]
    );
    res.json({ message: 'Proposal diupdate' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;