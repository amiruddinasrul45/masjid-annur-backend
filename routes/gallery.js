const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET galeri (publik)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM gallery ORDER BY date DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST tambah galeri (butuh login)
router.post('/', requireAuth, async (req, res) => {
  const { id, date, title, description, imageUrl, category } = req.body;
  if (!title || !imageUrl) {
    return res.status(400).json({ error: 'Judul dan URL gambar wajib diisi.' });
  }
  try {
    await db.query(
      `INSERT INTO gallery (id, date, title, description, imageUrl, category) VALUES (?,?,?,?,?,?)`,
      [id, date || new Date().toISOString().split('T')[0], title, description, imageUrl, category]
    );
    res.status(201).json({ message: 'Galeri ditambahkan' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE galeri (butuh login)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ message: 'Item galeri dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
