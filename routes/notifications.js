const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM notifications ORDER BY id DESC');
    res.json(rows.map(n => ({
      ...n,
      isRead: !!n.isRead,
      metadata: n.meta_itemId ? {
        itemId: n.meta_itemId,
        amount: n.meta_amount,
        recipient: n.meta_recipient
      } : undefined
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id/read', async (req, res) => {
  try {
    await db.query('UPDATE notifications SET isRead = 1 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Notifikasi dibaca' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;