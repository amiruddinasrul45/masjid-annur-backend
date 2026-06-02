const express = require('express');
const router = express.Router();
const db = require('../db');

// GET semua kategori + subkategori + total
router.get('/', async (req, res) => {
  try {
    const [kategori] = await db.query('SELECT * FROM rab_kategori ORDER BY urutan');
    for (let k of kategori) {
      const [sub] = await db.query('SELECT * FROM rab_subkategori WHERE kategori_id = ? ORDER BY urutan', [k.id]);
      k.subkategori = sub;
      k.total = sub.reduce((acc, s) => acc + Number(s.nilai), 0);
    }
    const totalRAB = kategori.reduce((acc, k) => acc + k.total, 0);
    res.json({ kategori, totalRAB });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST tambah kategori
router.post('/kategori', async (req, res) => {
  const { nama } = req.body;
  const id = 'kat_' + Date.now();
  try {
    await db.query('INSERT INTO rab_kategori (id, nama) VALUES (?,?)', [id, nama]);
    res.status(201).json({ message: 'Kategori ditambahkan', id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH update kategori
router.patch('/kategori/:id', async (req, res) => {
  const { nama } = req.body;
  try {
    await db.query('UPDATE rab_kategori SET nama = ? WHERE id = ?', [nama, req.params.id]);
    res.json({ message: 'Kategori diupdate' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE kategori
router.delete('/kategori/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM rab_kategori WHERE id = ?', [req.params.id]);
    res.json({ message: 'Kategori dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST tambah subkategori
router.post('/subkategori', async (req, res) => {
  const { kategori_id, nama, nilai, keterangan } = req.body;
  const id = 'sub_' + Date.now();
  try {
    await db.query(
      'INSERT INTO rab_subkategori (id, kategori_id, nama, nilai, keterangan) VALUES (?,?,?,?,?)',
      [id, kategori_id, nama, nilai, keterangan]
    );
    res.status(201).json({ message: 'Sub kategori ditambahkan', id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH update subkategori
router.patch('/subkategori/:id', async (req, res) => {
  const { nama, nilai, keterangan } = req.body;
  try {
    await db.query(
      'UPDATE rab_subkategori SET nama = ?, nilai = ?, keterangan = ? WHERE id = ?',
      [nama, Number(nilai), keterangan, req.params.id]
    );
    res.json({ message: 'Sub kategori diupdate' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE subkategori
router.delete('/subkategori/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM rab_subkategori WHERE id = ?', [req.params.id]);
    res.json({ message: 'Sub kategori dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;