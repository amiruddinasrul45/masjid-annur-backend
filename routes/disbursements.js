const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM disbursements ORDER BY date DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  const { id, date, amount, recipient, purpose, category, proofInvoice } = req.body;
  try {
    await db.query(`INSERT INTO disbursements VALUES (?,?,?,?,?,?,?,'Disalurkan')`,
      [id, date, amount, recipient, purpose, category, proofInvoice]);
    res.status(201).json({ message: 'Penyaluran dicatat' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;