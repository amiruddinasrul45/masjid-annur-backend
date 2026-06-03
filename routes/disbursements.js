const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM disbursements ORDER BY date DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', requireAuth, async (req, res) => {
  const { id, date, amount, recipient, purpose, category, proofInvoice } = req.body;
  if (!recipient || !amount) return res.status(400).json({ error: 'Penerima dan jumlah wajib diisi.' });
  try {
    await db.query(
      `INSERT INTO disbursements (id, date, amount, recipient, purpose, category, proofInvoice, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Disalurkan')`,
      [id, date || new Date().toISOString().split('T')[0], amount, recipient, purpose, category, proofInvoice]
    );
    res.status(201).json({ message: 'Penyaluran dicatat' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id', requireAuth, async (req, res) => {
  const { date, amount, recipient, purpose, category, proofInvoice } = req.body;
  try {
    await db.query(
      'UPDATE disbursements SET date=?, amount=?, recipient=?, purpose=?, category=?, proofInvoice=? WHERE id=?',
      [date, amount, recipient, purpose, category, proofInvoice, req.params.id]
    );
    res.json({ message: 'Penyaluran diupdate' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM disbursements WHERE id=?', [req.params.id]);
    res.json({ message: 'Penyaluran dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
