const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { requireAuth } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'masjid_annur_secret_key';

// POST login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE username = ? AND isActive = 1', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'Username tidak ditemukan' });

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: 'Password salah' });

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role, name: admin.name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, admin: { id: admin.id, username: admin.username, role: admin.role, name: admin.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET verify token
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token tidak ada' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, admin: decoded });
  } catch {
    res.status(401).json({ valid: false, error: 'Token tidak valid' });
  }
});

// PATCH ganti username & password (butuh login)
router.patch('/credentials', requireAuth, async (req, res) => {
  const { newUsername, newPassword, currentPassword } = req.body;
  if (!newUsername || !newPassword || !currentPassword) {
    return res.status(400).json({ error: 'Semua field wajib diisi.' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE id = ?', [req.admin.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Admin tidak ditemukan' });

    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) return res.status(401).json({ error: 'Password saat ini salah.' });

    // Cek username tidak duplikat
    const [existing] = await db.query('SELECT id FROM admins WHERE username = ? AND id != ?', [newUsername, req.admin.id]);
    if (existing.length > 0) return res.status(400).json({ error: 'Username sudah dipakai admin lain.' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE admins SET username = ?, password = ? WHERE id = ?', [newUsername, hashed, req.admin.id]);
    res.json({ message: 'Kredensial berhasil diubah. Silakan login ulang.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET list semua admin (superadmin only)
router.get('/admins', requireAuth, async (req, res) => {
  if (req.admin.role !== 'superadmin') return res.status(403).json({ error: 'Akses ditolak' });
  try {
    const [rows] = await db.query('SELECT id, username, name, role, isActive, createdAt FROM admins');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
