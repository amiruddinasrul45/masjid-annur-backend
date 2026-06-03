const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET semua donasi TERVERIFIKASI (publik) — hanya status 'sukses'
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT dr.*, d.name as donorName, d.phone as donorPhone, d.alamat as donorAlamat
       FROM donation_records dr
       LEFT JOIN donors d ON dr.donor_id = d.id
       WHERE dr.status = 'sukses'
       ORDER BY dr.date DESC`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET donasi MENUNGGU VERIFIKASI (butuh login) — status 'proses'
router.get('/pending', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT dr.*, d.name as donorName, d.phone as donorPhone, d.alamat as donorAlamat
       FROM donation_records dr
       LEFT JOIN donors d ON dr.donor_id = d.id
       WHERE dr.status = 'proses'
       ORDER BY dr.date DESC, dr.id DESC`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET total terkumpul (publik) — hanya yang terverifikasi
router.get('/total', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT SUM(amount) as total FROM donation_records WHERE status = "sukses"'
    );
    res.json({ total: rows[0].total || 0 });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST tambah donasi baru
router.post('/', async (req, res) => {
  const { nama, jumlah, phone, alamat, type, sumber, description } = req.body;
  if (!nama || !jumlah) return res.status(400).json({ error: 'Nama dan jumlah donasi wajib diisi.' });

  const donationType = type || 'one-time';
  const sumberData = sumber || 'web'; // 'web' atau 'manual'
  // Donasi via web => menunggu verifikasi admin. Input manual oleh admin => langsung sukses.
  const status = sumberData === 'manual' ? 'sukses' : 'proses';
  const id = 'don_' + Date.now();
  const prefix = sumberData === 'manual' ? 'INV/MAN/' : 'INV/WEB/';
  const invoiceNumber = prefix + Date.now();

  try {
    let donorId = 'anon_' + Date.now();
    const [existing] = await db.query('SELECT id FROM donors WHERE name = ?', [nama]);

    if (existing.length > 0) {
      donorId = existing[0].id;
      if (phone) {
        await db.query('UPDATE donors SET phone = COALESCE(NULLIF(phone, ""), ?) WHERE id = ?', [phone, donorId]);
      }
      if (alamat) {
        await db.query('UPDATE donors SET alamat = ? WHERE id = ?', [alamat, donorId]);
      }
    } else {
      await db.query(
        `INSERT INTO donors (id, name, phone, alamat, type, status, totalContribution, avatar) VALUES (?, ?, ?, ?, ?, 'inactive', 0, '')`,
        [donorId, nama, phone || null, alamat || null, donationType]
      );
    }

    const keterangan = description || (sumberData === 'manual' ? 'Donasi via Manual/Admin' : 'Donasi via Web');
    await db.query(
      `INSERT INTO donation_records (id, donor_id, amount, date, type, description, invoiceNumber, status)
       VALUES (?, ?, ?, CURDATE(), ?, ?, ?, ?)`,
      [id, donorId, jumlah, donationType, keterangan, invoiceNumber, status]
    );

    // totalContribution hanya bertambah jika donasi sudah terverifikasi (sukses)
    if (status === 'sukses') {
      await db.query('UPDATE donors SET totalContribution = totalContribution + ? WHERE id = ?', [jumlah, donorId]);
    }

    res.status(201).json({
      message: status === 'sukses' ? 'Donasi berhasil disimpan' : 'Donasi diterima, menunggu verifikasi admin',
      id, invoiceNumber, status,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Helper: hitung ulang totalContribution donor
async function recalcDonor(donorId) {
  const [total] = await db.query(
    'SELECT SUM(amount) as total FROM donation_records WHERE donor_id=? AND status="sukses"',
    [donorId]
  );
  await db.query('UPDATE donors SET totalContribution=? WHERE id=?', [total[0].total || 0, donorId]);
}

// PATCH verifikasi donasi (butuh login) — set status 'sukses'
router.patch('/:id/verify', requireAuth, async (req, res) => {
  try {
    await db.query('UPDATE donation_records SET status="sukses" WHERE id=?', [req.params.id]);
    const [rec] = await db.query('SELECT donor_id FROM donation_records WHERE id=?', [req.params.id]);
    if (rec.length > 0) await recalcDonor(rec[0].donor_id);
    res.json({ message: 'Donasi diverifikasi' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH tolak donasi (butuh login) — set status 'gagal'
router.patch('/:id/reject', requireAuth, async (req, res) => {
  try {
    await db.query('UPDATE donation_records SET status="gagal" WHERE id=?', [req.params.id]);
    const [rec] = await db.query('SELECT donor_id FROM donation_records WHERE id=?', [req.params.id]);
    if (rec.length > 0) await recalcDonor(rec[0].donor_id);
    res.json({ message: 'Donasi ditolak' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH edit donasi (butuh login)
router.patch('/:id', requireAuth, async (req, res) => {
  const { amount, date, type, description } = req.body;
  try {
    await db.query(
      'UPDATE donation_records SET amount=?, date=?, type=?, description=? WHERE id=?',
      [amount, date, type, description, req.params.id]
    );
    const [rec] = await db.query('SELECT donor_id FROM donation_records WHERE id=?', [req.params.id]);
    if (rec.length > 0) await recalcDonor(rec[0].donor_id);
    res.json({ message: 'Donasi diupdate' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE donasi (butuh login)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [rec] = await db.query('SELECT donor_id, amount FROM donation_records WHERE id=?', [req.params.id]);
    await db.query('DELETE FROM donation_records WHERE id=?', [req.params.id]);
    if (rec.length > 0) await recalcDonor(rec[0].donor_id);
    res.json({ message: 'Donasi dihapus' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
