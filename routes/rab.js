const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireBendahara } = require('../middleware/auth');

// GET semua kategori + subkategori + total (publik)
router.get('/', async (req, res) => {
  try {
    const [kategori] = await db.query('SELECT * FROM rab_kategori ORDER BY urutan ASC, id ASC');
    for (let k of kategori) {
      const [sub] = await db.query(
        'SELECT * FROM rab_subkategori WHERE kategori_id = ? ORDER BY urutan ASC, id ASC',
        [k.id]
      );
      k.subkategori = sub;
      k.total = sub.reduce((acc, s) => acc + Number(s.nilai), 0);
    }
    const totalRAB = kategori.reduce((acc, k) => acc + k.total, 0);
    res.json({ kategori, totalRAB });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST tambah kategori (butuh login)
router.post('/kategori', requireAuth, async (req, res) => {
  const { nama } = req.body;
  if (!nama) return res.status(400).json({ error: 'Nama kategori wajib diisi.' });
  const id = 'kat_' + Date.now();
  try {
    // Ambil urutan terakhir
    const [last] = await db.query('SELECT MAX(urutan) as maxUrutan FROM rab_kategori');
    const urutan = (last[0].maxUrutan || 0) + 1;
    await db.query('INSERT INTO rab_kategori (id, nama, urutan) VALUES (?,?,?)', [id, nama, urutan]);
    res.status(201).json({ message: 'Kategori ditambahkan', id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH update kategori (butuh login)
router.patch('/kategori/:id', requireAuth, async (req, res) => {
  const { nama } = req.body;
  if (!nama) return res.status(400).json({ error: 'Nama kategori wajib diisi.' });
  try {
    await db.query('UPDATE rab_kategori SET nama = ? WHERE id = ?', [nama, req.params.id]);
    res.json({ message: 'Kategori diupdate' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE kategori (butuh login)
router.delete('/kategori/:id', requireAuth, async (req, res) => {
  try {
    // Hapus subkategori dulu, lalu kategori
    await db.query('DELETE FROM rab_subkategori WHERE kategori_id = ?', [req.params.id]);
    await db.query('DELETE FROM rab_kategori WHERE id = ?', [req.params.id]);
    res.json({ message: 'Kategori dan sub kategorinya dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST tambah subkategori (butuh login)
router.post('/subkategori', requireAuth, async (req, res) => {
  const { kategori_id, nama, nilai, keterangan } = req.body;
  if (!kategori_id || !nama || nilai === undefined) {
    return res.status(400).json({ error: 'kategori_id, nama, dan nilai wajib diisi.' });
  }
  const id = 'sub_' + Date.now();
  try {
    const [last] = await db.query(
      'SELECT MAX(urutan) as maxUrutan FROM rab_subkategori WHERE kategori_id = ?',
      [kategori_id]
    );
    const urutan = (last[0].maxUrutan || 0) + 1;
    await db.query(
      'INSERT INTO rab_subkategori (id, kategori_id, nama, nilai, keterangan, urutan) VALUES (?,?,?,?,?,?)',
      [id, kategori_id, nama, Number(nilai), keterangan || null, urutan]
    );
    res.status(201).json({ message: 'Sub kategori ditambahkan', id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH update subkategori (butuh login)
router.patch('/subkategori/:id', requireAuth, async (req, res) => {
  const { nama, nilai, keterangan } = req.body;
  if (!nama || nilai === undefined) {
    return res.status(400).json({ error: 'Nama dan nilai wajib diisi.' });
  }
  try {
    await db.query(
      'UPDATE rab_subkategori SET nama = ?, nilai = ?, keterangan = ? WHERE id = ?',
      [nama, Number(nilai), keterangan || null, req.params.id]
    );
    res.json({ message: 'Sub kategori diupdate' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE subkategori (butuh login)
router.delete('/subkategori/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM rab_subkategori WHERE id = ?', [req.params.id]);
    res.json({ message: 'Sub kategori dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
