const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'masjid_annur_secret_key';

/**
 * Middleware: verifikasi JWT token dari header Authorization.
 * Gunakan di route yang butuh login admin.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token tidak ditemukan. Silakan login terlebih dahulu.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token tidak valid atau sudah expired. Silakan login ulang.' });
  }
}

/**
 * Middleware: hanya superadmin atau bendahara yang boleh akses.
 */
function requireBendahara(req, res, next) {
  if (!req.admin) return res.status(401).json({ error: 'Unauthorized' });
  if (!['superadmin', 'bendahara'].includes(req.admin.role)) {
    return res.status(403).json({ error: 'Akses ditolak. Hanya bendahara atau superadmin.' });
  }
  next();
}

/**
 * Middleware: hanya superadmin atau panitia yang boleh akses.
 */
function requirePanitia(req, res, next) {
  if (!req.admin) return res.status(401).json({ error: 'Unauthorized' });
  if (!['superadmin', 'panitia'].includes(req.admin.role)) {
    return res.status(403).json({ error: 'Akses ditolak. Hanya panitia atau superadmin.' });
  }
  next();
}

module.exports = { requireAuth, requireBendahara, requirePanitia };
