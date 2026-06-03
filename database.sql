-- ============================================================
-- DATABASE MASJID AN-NUR
-- Import file ini via cPanel → phpMyAdmin
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ── TABEL PANITIA ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `panitia` (
  `id` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `jabatan` varchar(100) NOT NULL,
  `inisial` varchar(5) DEFAULT NULL,
  `urutan` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── TABEL DONORS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `donors` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` text DEFAULT NULL,
  `type` enum('monthly','one-time') NOT NULL DEFAULT 'one-time',
  `status` enum('active','inactive') NOT NULL DEFAULT 'inactive',
  `totalContribution` bigint NOT NULL DEFAULT 0,
  `monthlyCommitment` bigint DEFAULT NULL,
  `periodYears` int DEFAULT NULL,
  `monthsPaid` int DEFAULT NULL,
  `totalMonthsCommit` int DEFAULT NULL,
  `lastPaymentDate` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── TABEL DONATION RECORDS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS `donation_records` (
  `id` varchar(50) NOT NULL,
  `donor_id` varchar(50) NOT NULL,
  `amount` bigint NOT NULL,
  `date` date NOT NULL,
  `type` enum('monthly','one-time') NOT NULL DEFAULT 'one-time',
  `description` text DEFAULT NULL,
  `invoiceNumber` varchar(100) DEFAULT NULL,
  `status` enum('proses','sukses','gagal') NOT NULL DEFAULT 'sukses',
  PRIMARY KEY (`id`),
  KEY `donor_id` (`donor_id`),
  CONSTRAINT `fk_donation_donor` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── TABEL PROPOSALS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `proposals` (
  `id` varchar(50) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `targetCost` bigint NOT NULL DEFAULT 0,
  `currentCollected` bigint NOT NULL DEFAULT 0,
  `urgency` varchar(50) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Aktif',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── TABEL ALLOCATIONS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `allocations` (
  `id` varchar(50) NOT NULL,
  `item` varchar(200) NOT NULL,
  `estimatedCost` bigint NOT NULL DEFAULT 0,
  `actualSpent` bigint NOT NULL DEFAULT 0,
  `category` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Belum Dimulai',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── TABEL DISBURSEMENTS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS `disbursements` (
  `id` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `amount` bigint NOT NULL,
  `recipient` varchar(200) NOT NULL,
  `purpose` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `proofInvoice` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Disalurkan',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── TABEL PROGRESS REPORTS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS `progress_reports` (
  `id` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `photoUrl` text DEFAULT NULL,
  `reporter` varchar(100) DEFAULT NULL,
  `percentageBefore` int DEFAULT 0,
  `percentageAfter` int DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── TABEL GALLERY ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `gallery` (
  `id` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── TABEL NOTIFICATIONS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` varchar(50) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text DEFAULT NULL,
  `time` varchar(100) DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `type` varchar(50) DEFAULT 'info',
  `meta_itemId` varchar(50) DEFAULT NULL,
  `meta_amount` bigint DEFAULT NULL,
  `meta_recipient` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── TABEL ADMINS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` enum('superadmin','panitia','bendahara') NOT NULL DEFAULT 'panitia',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── TABEL RAB KATEGORI ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS `rab_kategori` (
  `id` varchar(50) NOT NULL,
  `nama` varchar(200) NOT NULL,
  `urutan` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── TABEL RAB SUBKATEGORI ────────────────────────────────────
CREATE TABLE IF NOT EXISTS `rab_subkategori` (
  `id` varchar(50) NOT NULL,
  `kategori_id` varchar(50) NOT NULL,
  `nama` varchar(200) NOT NULL,
  `nilai` bigint NOT NULL DEFAULT 0,
  `keterangan` text DEFAULT NULL,
  `urutan` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `kategori_id` (`kategori_id`),
  CONSTRAINT `fk_sub_kategori` FOREIGN KEY (`kategori_id`) REFERENCES `rab_kategori` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DATA AWAL
-- ============================================================

-- Admins (password: admin123)
INSERT IGNORE INTO `admins` (`username`, `password`, `name`, `role`) VALUES
('superadmin', '$2b$10$95ut6fc0iYzH.SoOJRqFB.GCp2jRc7YVXfcf/h24rhvgwqvgaldp2', 'Super Admin Masjid An-Nur', 'superadmin'),
('panitia1',   '$2b$10$95ut6fc0iYzH.SoOJRqFB.GCp2jRc7YVXfcf/h24rhvgwqvgaldp2', 'Panitia Pembangunan', 'panitia'),
('bendahara1', '$2b$10$95ut6fc0iYzH.SoOJRqFB.GCp2jRc7YVXfcf/h24rhvgwqvgaldp2', 'Bendahara Masjid', 'bendahara');

-- RAB Kategori
INSERT IGNORE INTO `rab_kategori` (`id`, `nama`, `urutan`) VALUES
('kat_a', 'Renovasi Bangunan Utama Masjid', 1),
('kat_b', 'Rumah Imam & Tempat Wudhu', 2),
('kat_c', 'Pembangunan Gudang Masjid', 3);

-- RAB Subkategori
INSERT IGNORE INTO `rab_subkategori` (`id`, `kategori_id`, `nama`, `nilai`, `keterangan`, `urutan`) VALUES
('sub_a1', 'kat_a', 'Pekerjaan Pondasi dan Beton (Borepile & Cakar Ayam)', 747723714, 'Termasuk bore pile 8m dan cakar ayam', 1),
('sub_a2', 'kat_a', 'Pekerjaan Pasangan (Dinding Bata, Plester & GRC Ornamen)', 579062780, 'Dinding bata merah + plester halus + kaligrafi GRC', 2),
('sub_a3', 'kat_a', 'Pekerjaan Pintu dan Jendela (Kusen Aluminium Custom)', 33283521, 'Kusen aluminium anodize coklat tua', 3),
('sub_a4', 'kat_a', 'Pekerjaan Elektrikal (Wiring & Jaringan Lampu)', 20973600, 'Instalasi listrik + lampu gantung kristal', 4),
('sub_b1', 'kat_b', 'Pekerjaan Pondasi dan Beton Sloop', 51625918, 'Pondasi menerus + sloof beton bertulang', 1),
('sub_b2', 'kat_b', 'Pekerjaan Pasangan Dinding & Keramik Sekat', 91808788, 'Dinding batako + keramik 40x40 putih', 2),
('sub_b3', 'kat_b', 'Pekerjaan Pintu dan Jendela', 10453324, 'Pintu aluminium + kaca tempered', 3),
('sub_b4', 'kat_b', 'Pekerjaan Elektrikal & Teknis Sanitair', 3924300, 'Instalasi kran + closet + listrik', 4),
('sub_c1', 'kat_c', 'Pekerjaan Pondasi dan Beton Cor', 31593414, 'Pondasi cakar ayam + kolom beton', 1),
('sub_c2', 'kat_c', 'Pekerjaan Pasangan Batako Ringan & Atap', 30334501, 'Dinding batako ringan + atap spandek', 2),
('sub_c3', 'kat_c', 'Pekerjaan Pintu Besi Lipat Gudang', 7999179, 'Pintu besi lipat galvanis tebal 2mm', 3),
('sub_c4', 'kat_c', 'Pekerjaan Elektrikal', 1207100, 'Instalasi listrik dasar gudang', 4);

-- Donors
INSERT IGNORE INTO `donors` VALUES
('swadaya_base','Dana Swadaya Awal Masjid An-Nur','panitia.annur@gmail.com','081100000000','','one-time','inactive',250000000,NULL,NULL,NULL,NULL,NULL),
('d1','Ir. H. Budi Hartono','budi.hartono@gmail.com','081123456789','','monthly','active',60000000,2500000,3,24,36,'2026-05-10'),
('d2','Siti Rahmawati, S.E.','siti.rahma@outlook.com','081298765432','','monthly','active',24000000,1000000,2,24,24,'2026-05-05'),
('d3','Ahmad Fauzan','fauzan_tambang@gmail.com','085712345678','','monthly','active',45000000,3000000,2,15,24,'2026-05-12'),
('d4','dr. Hendra Wijaya Sp.PD','hendra.wijaya@klinikpratama.com','081112223334','','monthly','active',96000000,4000000,3,24,36,'2026-05-20'),
('d5','Prof. Dr. Hj. Eliyana','eliyana.unair@yahoo.com','081388889999','','monthly','active',30000000,1500000,2,20,24,'2026-05-15'),
('d6','H. Rahmat Sujatmiko','rahmat.sujatmiko@sujatmiko-corp.id','081255556666','','one-time','inactive',250000000,NULL,NULL,NULL,NULL,NULL),
('d7','Hamba Allah (Jakarta)','hamba.allah.jkt@gmail.com','081199990000','','one-time','inactive',150000000,NULL,NULL,NULL,NULL,NULL),
('d8','Warga Blok B Bumi Daya Indah','kolektif.blokb@gmail.com','081511112222','','one-time','inactive',37500000,NULL,NULL,NULL,NULL,NULL);

-- Donation Records
INSERT IGNORE INTO `donation_records` VALUES
('dh_base_1','swadaya_base',250000000,'2026-04-01','one-time','Dana Kas Awal Swadaya Pengurus & Jamaah','INV/SWD/2026/04/001','sukses'),
('dh1_1','d1',2500000,'2026-05-10','monthly','Iuran Bulanan - Bulan Ke-24','INV/MHD/2026/05/012','sukses'),
('dh1_2','d1',2500000,'2026-04-10','monthly','Iuran Bulanan - Bulan Ke-23','INV/MHD/2026/04/008','sukses'),
('dh1_3','d1',2500000,'2026-03-10','monthly','Iuran Bulanan - Bulan Ke-22','INV/MHD/2026/03/015','sukses'),
('dh1_4','d1',52500000,'2026-02-15','monthly','Akumulasi iuran bulan 1 s/d 21','INV/MHD/2026/02/099','sukses'),
('dh2_1','d2',1000000,'2026-05-05','monthly','Iuran Bulanan - Bulan Ke-24','INV/MHD/2026/05/002','sukses'),
('dh2_2','d2',1000000,'2026-04-05','monthly','Iuran Bulanan - Bulan Ke-23','INV/MHD/2026/04/002','sukses'),
('dh2_3','d2',22000000,'2026-03-01','monthly','Konsolidasi Pembayaran Bulan Ke-1 s/d 22','INV/MHD/2026/03/001','sukses'),
('dh3_1','d3',3000000,'2026-05-12','monthly','Iuran Bulanan - Bulan Ke-15','INV/MHD/2026/05/019','sukses'),
('dh3_2','d3',3000000,'2026-04-12','monthly','Iuran Bulanan - Bulan Ke-14','INV/MHD/2026/04/011','sukses'),
('dh3_3','d3',39000000,'2026-03-12','monthly','Konsolidasi Iuran Bulan ke-1 s/d 13','INV/MHD/2026/03/020','sukses'),
('dh4_1','d4',4000000,'2026-05-20','monthly','Iuran Bulanan - Bulan Ke-24','INV/MHD/2026/05/042','sukses'),
('dh4_2','d4',4000000,'2026-04-20','monthly','Iuran Bulanan - Bulan Ke-23','INV/MHD/2026/04/035','sukses'),
('dh4_3','d4',88000000,'2026-03-15','monthly','Konsolidasi Iuran Bulan ke-1 s/d 22','INV/MHD/2026/03/050','sukses'),
('dh5_1','d5',1500000,'2026-05-15','monthly','Iuran Bulanan - Bulan Ke-20','INV/MHD/2026/05/028','sukses'),
('dh5_2','d5',1500000,'2026-04-15','monthly','Iuran Bulanan - Bulan Ke-19','INV/MHD/2026/04/027','sukses'),
('dh5_3','d5',27000000,'2026-03-20','monthly','Konsolidasi Iuran Bulan ke-1 s/d 18','INV/MHD/2026/03/062','sukses'),
('dh6_1','d6',250000000,'2026-04-20','one-time','Donasi Pembelian Bahan GRC Ornamen Kubah','INV/OBN/2026/04/100','sukses'),
('dh7_1','d7',150000000,'2026-05-12','one-time','Donasi Khusus Bor Pile Utama & Cor Cakar Ayam','INV/OBN/2026/05/088','sukses'),
('dh8_1','d8',37500000,'2026-05-25','one-time','Donasi Kolektif Paving Parkir Blok B','INV/OBN/2026/05/104','sukses');

-- Proposals
INSERT IGNORE INTO `proposals` VALUES
('p1','Struktur Beton Kubah Utama','Pembangunan bekisting, perakitan besi tulangan, pengecoran beton silinder kubah induk diameter 12 meter.',450000000,450000000,'Sangat Mendesak','Masjid Utama','Hammer','Terpenuhi'),
('p2','Finishing Dinding & Plester Ornamen','Pekerjaan plester dinding luar, pengerjaan kaligrafi ukiran semen (GRC) dan kubah kecil sudut.',350000000,280000000,'Mendesak','Masjid Utama','Paintbrush','Aktif'),
('p3','Pengadaan Marmer Lantai Utama','Pemasangan marmer putih impor untuk ruang ibadah utama lantai satu seluas 400 m².',400000000,162500000,'Mendesak','Masjid Utama','Grid','Aktif'),
('p4','Sistem Tata Suara (Sound System)','Pemasangan amplifier, speaker kolom, mikrofon imam, dan peredam gema.',150000000,50000000,'Sedang','Rumah Imam & Wudhu','Volume2','Aktif'),
('p5','Pembangunan Gudang Masjid An-Nur','Pekerjaan sipil struktur pondasi, dinding batako, pintu besi lipat, dan instalasi listrik.',71134190,30000000,'Rencana Jangka Panjang','Gudang Masjid','Compass','Aktif');

-- Disbursements
INSERT IGNORE INTO `disbursements` VALUES
('disb1','2026-05-10',200000000,'PT Sinar Beton Mandiri','Pembayaran bore pile pondasi masjid termin 100%','Struktur Akhir','INV/SBM/2026/0488','Disalurkan'),
('disb2','2026-05-18',250000000,'CV Baja Presisi Nusantara','Pelunasan pekerjaan kolom struktur lantai 1 masjid','Struktur Akhir','INV/BPN/V/6612','Disalurkan'),
('disb3','2026-05-24',145000000,'Artistic Dome Specialist Yogyakarta','Pelunasan pembuatan & perakitan rangka besi kubah induk','Kubah & Ornamen','INV/ADS-Y/2026/099','Disalurkan'),
('disb4','2026-05-27',115000000,'Sanggar Seni Kaligrafi Al-Haramain','Pembayaran pengerjaan kaligrafi interior kubah utama masjid','Kubah & Ornamen','INV/SKH/0214-MA','Disalurkan');

-- Progress Reports
INSERT IGNORE INTO `progress_reports` VALUES
('prog1','2026-05-28','Masjid Utama','Tahap Akhir Pengecatan Ornamen Kaligrafi Kubah','Pengerjaan kaligrafi menggunakan cat khusus anti-jamur emas prada di sekeliling kubah utama telah selesai 100%.','https://images.unsplash.com/photo-1590076211181-4351cddc290c?auto=format&fit=crop&w=800&q=80','Soni Hermawan (Koordinator Lapangan)',90,100),
('prog2','2026-05-26','Masjid Utama','Pemasangan Tiang Scaffolding Penyangga Mezzanine','Pengerjaan penyangga besi silang scaffolding untuk persiapan pengecoran dak lantai dasar ruang tambahan.','https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=800&q=80','Soni Hermawan (Koordinator Lapangan)',65,78),
('prog3','2026-05-24','Masjid Utama','Plesteran Dinding Depan Sisi Mihrab','Pekerjaan meratakan plester semen sisi depan tempat imam (mihrab) masjid.','https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80','Haji Ahmad Mudzakir (Ketua Pembangunan)',45,55),
('prog4','2026-05-20','Rumah Imam & Tempat Wudhu','Pemasangan Pipa Saluran Air Tempat Wudhu Pria','Instalasi pipa PVC untuk suplai air bersih kran wudhu utama pria sebanyak 16 titik kran.','https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80','Pak Mulyono (Teknisi Air)',20,50);

-- Gallery
INSERT IGNORE INTO `gallery` VALUES
('g1','2026-05-25','Kerja Bakti Bersama Pengecoran Ring Balk Samping','Gotong royong warga Perumahan Bumi Daya Indah bersama tukang memindahkan material cor.','https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80','Kerja Bakti'),
('g2','2026-05-18','Rapat Evaluasi Pembangunan Masjid Termin 2','Dihadiri oleh RT, RW, tokoh masyarakat, dan panitia pembangunan masjid.','https://images.unsplash.com/photo-1590076135891-9fdaef2beba0?auto=format&fit=crop&w=800&q=80','Rapat'),
('g3','2026-05-10','Pengerjaan Pembesian Beton Bored Pile','Awal mula penggalian bor tanah sedalam 8 meter untuk pondasi masjid utama.','https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80','Pembangunan'),
('g4','2026-05-01','Pengajian Akbar Silaturahmi & Doa Restu','Pengajian bersama sebagai penanda kelancaran peletakkan batu pertama masjid.','https://images.unsplash.com/photo-1590076211181-4351cddc290c?auto=format&fit=crop&w=800&q=80','Pengajian');

-- Notifications
INSERT IGNORE INTO `notifications` VALUES
('n1','Dana Masuk','Donasi sebesar Rp 1.500.000 diterima dari donatur melalui transfer BSI.','2 jam yang lalu',0,'donation',NULL,NULL,NULL),
('n2','Penyaluran Dana Berhasil','Rp 115.000.000 telah disalurkan kepada Sanggar Seni Kaligrafi Al-Haramain.','2 hari yang lalu',0,'disbursement','disb4',115000000,'Sanggar Seni Kaligrafi Al-Haramain'),
('n3','Laporan Progres Baru','Update: Tahap Akhir Pengecatan Ornamen Kaligrafi Kubah (100%).','1 hari yang lalu',1,'progress',NULL,NULL,NULL),
('n4','Penyaluran Dana Berhasil','Rp 145.000.000 disalurkan ke Artistic Dome Specialist Yogyakarta.','5 hari yang lalu',1,'disbursement','disb3',145000000,'Artistic Dome Specialist Yogyakarta');

-- Allocations
INSERT IGNORE INTO `allocations` VALUES
('al1','Pengecoran Pondasi Bore Pile Masjid',200000000,200000000,'Struktur Akhir','Selesai'),
('al2','Struktur Kolom & Ring Balk Lantai 1',250000000,250000000,'Struktur Akhir','Selesai'),
('al3','Konstruksi Baja Ringan Kubah Induk',150000000,145000000,'Kubah & Ornamen','Selesai'),
('al4','Plester Halus & Kaligrafi GRC Kubah',115000000,115000000,'Kubah & Ornamen','Selesai'),
('al5','Pengadaan Marmer Ibadah Utama (DP)',250000000,162500000,'Lainnya','Pengerjaan'),
('al6','Instalasi Jaringan Kabel & Lampu Gantung',80000000,0,'Sound System','Belum Dimulai');

SET FOREIGN_KEY_CHECKS = 1;
-- ============================================================
-- Panitia default
INSERT IGNORE INTO `panitia` (`id`, `nama`, `jabatan`, `inisial`, `urutan`) VALUES
('pan_1', 'H. Ahmad Mudzakir', 'Ketua Panitia', 'AM', 1),
('pan_2', 'H. Syamsul Bahri', 'Wakil Ketua', 'SB', 2),
('pan_3', 'Ustadz Rahmat Hidayat', 'Sekretaris', 'RH', 3),
('pan_4', 'H. Muh. Yunus', 'Bendahara', 'MY', 4),
('pan_5', 'H. Abd. Kadir', 'Koordinator Lapangan', 'AK', 5),
('pan_6', 'Ir. Sudirman', 'Pengawas Teknik', 'SD', 6);

-- ============================================================
-- UPDATE PASSWORD: username=annur, password=448630
-- Jalankan query ini setelah import untuk ganti kredensial:
-- UPDATE admins SET username='annur', password='$2b$10$YKmEMFwQFkFtV2jT5Rg4DeJ7X9pLQNsOuHvBk3CaWImZD1nRtP7tC' WHERE username='superadmin';
-- (hash di atas = bcrypt dari '448630')
-- ATAU gunakan fitur "Ganti Kredensial" di Dashboard Admin setelah login.
-- ============================================================
-- SELESAI — login awal: superadmin / admin123
-- ============================================================
