const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET semua panitia (publik - untuk tampil di frontend)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM panitia ORDER BY urutan ASC, id ASC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST tambah panitia (butuh login)
router.post('/', requireAuth, async (req, res) => {
  const { nama, jabatan, inisial, urutan } = req.body;
  if (!nama || !jabatan) return res.status(400).json({ error: 'Nama dan jabatan wajib diisi.' });
  const id = 'pan_' + Date.now();
  try {
    const [last] = await db.query('SELECT MAX(urutan) as max FROM panitia');
    const ord = urutan || (last[0].max || 0) + 1;
    await db.query(
      'INSERT INTO panitia (id, nama, jabatan, inisial, urutan) VALUES (?,?,?,?,?)',
      [id, nama, jabatan, inisial || nama.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase(), ord]
    );
    res.status(201).json({ message: 'Panitia ditambahkan', id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH update panitia (butuh login)
router.patch('/:id', requireAuth, async (req, res) => {
  const { nama, jabatan, inisial, urutan } = req.body;
  try {
    await db.query(
      'UPDATE panitia SET nama=?, jabatan=?, inisial=?, urutan=? WHERE id=?',
      [nama, jabatan, inisial, urutan, req.params.id]
    );
    res.json({ message: 'Panitia diupdate' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE panitia (butuh login)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM panitia WHERE id=?', [req.params.id]);
    res.json({ message: 'Panitia dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
