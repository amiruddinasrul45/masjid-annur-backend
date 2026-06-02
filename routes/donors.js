const express = require('express');
const router = express.Router();
const db = require('../db');

// GET semua donors dengan history
router.get('/', async (req, res) => {
  try {
    const [donors] = await db.query('SELECT * FROM donors');
    for (let donor of donors) {
      const [history] = await db.query(
        'SELECT * FROM donation_records WHERE donor_id = ? ORDER BY date DESC',
        [donor.id]
      );
      donor.history = history;
    }
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;