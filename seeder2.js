const db = require('./db');

async function seed() {
  console.log('🌱 Mulai mengisi data...');

  await db.query(`INSERT IGNORE INTO proposals VALUES
    ('p1','Struktur Beton Kubah Utama','Pembangunan bekisting, perakitan besi tulangan, pengecoran beton silinder kubah induk diameter 12 meter.',450000000,450000000,'Sangat Mendesak','Masjid Utama','Hammer','Terpenuhi'),
    ('p2','Finishing Dinding & Plester Ornamen','Pekerjaan plester dinding luar, pengerjaan kaligrafi ukiran semen (mushaf GRC) dan kubah kecil sudut.',350000000,280000000,'Mendesak','Masjid Utama','Paintbrush','Aktif'),
    ('p3','Pengadaan Marmer Lantai Utama','Pemasangan marmer putih impor ukuran 60x60 cm untuk ruang ibadah utama lantai satu seluas 400 m².',400000000,162500000,'Mendesak','Masjid Utama','Grid','Aktif'),
    ('p4','Sistem Tata Suara (Sound System) Akustik','Pemasangan amplifier, speaker kolom khusus akustik masjid, mikrofon imam, dan peredam gema.',150000000,50000000,'Sedang','Rumah Imam & Wudhu','Volume2','Aktif'),
    ('p5','Pembangunan Gudang Masjid An-Nur','Pekerjaan sipil struktur pondasi, pemasangan dinding batako luar, pintu besi lipat, serta instalasi kelistrikan.',71134190,30000000,'Rencana Jangka Panjang','Gudang Masjid','Compass','Aktif')
  `);
  console.log('✅ Proposals done!');

  await db.query(`INSERT IGNORE INTO allocations VALUES
    ('al1','Pengecoran Pondasi Bore Pile Masjid',200000000,200000000,'Struktur Akhir','Selesai'),
    ('al2','Struktur Kolom & Ring Balk Lantai 1',250000000,250000000,'Struktur Akhir','Selesai'),
    ('al3','Konstruksi Baja Ringan Kubah Induk',150000000,145000000,'Kubah & Ornamen','Selesai'),
    ('al4','Plester Halus & Kaligrafi GRC Kubah',115000000,115000000,'Kubah & Ornamen','Selesai'),
    ('al5','Pengadaan Marmer Ibadah Utama (DP)',250000000,162500000,'Lainnya','Pengerjaan'),
    ('al6','Instalasi Jaringan Kabel & Lampu Gantung',80000000,0,'Sound System','Belum Dimulai')
  `);
  console.log('✅ Allocations done!');

  await db.query(`INSERT IGNORE INTO disbursements VALUES
    ('disb1','2026-05-10',200000000,'PT Sinar Beton Mandiri','Pembayaran bore pile pondasi masjid termin 100%','Struktur Akhir','INV/SBM/2026/0488','Disalurkan'),
    ('disb2','2026-05-18',250000000,'CV Baja Presisi Nusantara','Pelunasan pekerjaan kolom struktur lantai 1 masjid','Struktur Akhir','INV/BPN/V/6612','Disalurkan'),
    ('disb3','2026-05-24',145000000,'Artistic Dome Specialist Yogyakarta','Pelunasan pembuatan & perakitan rangka besi kubah induk','Kubah & Ornamen','INV/ADS-Y/2026/099','Disalurkan'),
    ('disb4','2026-05-27',115000000,'Sanggar Seni Kaligrafi Al-Haramain','Pembayaran pengerjaan kaligrafi interior kubah utama masjid','Kubah & Ornamen','INV/SKH/0214-MA','Disalurkan')
  `);
  console.log('✅ Disbursements done!');

  await db.query(`INSERT IGNORE INTO progress_reports VALUES
    ('prog1','2026-05-28','Masjid Utama','Tahap Akhir Pengecatan Ornamen Kaligrafi Kubah','Pengerjaan kaligrafi menggunakan cat khusus anti-jamur emas prada di sekeliling kubah utama telah selesai 100%.','https://images.unsplash.com/photo-1590076211181-4351cddc290c?auto=format&fit=crop&w=800&q=80','Soni Hermawan (Koordinator Lapangan)',90,100),
    ('prog2','2026-05-26','Masjid Utama','Pemasangan Tiang Scaffolding Penyangga Mezzanine','Pengerjaan penyangga besi silang scaffolding untuk persiapan pengecoran dak lantai dasar ruang tambahan.','https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=800&q=80','Soni Hermawan (Koordinator Lapangan)',65,78),
    ('prog3','2026-05-24','Masjid Utama','Plesteran Dinding Depan Sisi Mihrab','Pekerjaan meratakan plester semen sisi depan tempat imam (mihrab) masjid.','https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80','Haji Ahmad Mudzakir (Ketua Pembangunan)',45,55),
    ('prog4','2026-05-20','Rumah Imam & Tempat Wudhu','Pemasangan Pipa Saluran Air Tempat Wudhu Pria','Instalasi pipa PVC untuk suplai air bersih kran wudhu utama pria sebanyak 16 titik kran.','https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80','Pak Mulyono (Teknisi Air)',20,50)
  `);
  console.log('✅ Progress reports done!');

  await db.query(`INSERT IGNORE INTO gallery VALUES
    ('g1','2026-05-25','Kerja Bakti Bersama Pengecoran Ring Balk Samping','Gotong royong warga Perumahan Bumi Daya Indah bergotong royong bersama tukang memindahkan material cor.','https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80','Kerja Bakti'),
    ('g2','2026-05-18','Rapat Evaluasi Pembangunan Masjid Termin 2','Dihadiri oleh RT, RW, tokoh masyarakat, dan panitia pembangunan masjid.','https://images.unsplash.com/photo-1590076135891-9fdaef2beba0?auto=format&fit=crop&w=800&q=80','Rapat'),
    ('g3','2026-05-10','Pengerjaan Pembesian Beton Bored Pile','Awal mula penggalian bor tanah sedalam 8 meter untuk pondasi masjid utama.','https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80','Pembangunan'),
    ('g4','2026-05-01','Pengajian Akbar Silaturahmi & Doa Restu','Pengajian bersama KH. Anwar Zahid sebagai penanda kelancaran peletakkan batu pertama.','https://images.unsplash.com/photo-1590076211181-4351cddc290c?auto=format&fit=crop&w=800&q=80','Pengajian')
  `);
  console.log('✅ Gallery done!');

  await db.query(`INSERT IGNORE INTO notifications VALUES
    ('n1','Dana Masuk Selesai','Donasi sebesar Rp 1.500.000,00 diterima dari Donatur Hamba Allah melalui transfer Mandiri Instan.','2 jam yang lalu',0,'donation',NULL,NULL,NULL),
    ('n2','Penyaluran Dana Berhasil','Rp 115.000.000,00 telah disalurkan kepada Sanggar Seni Kaligrafi Al-Haramain untuk pelunasan ornamen kubah masjid.','2 hari yang lalu',0,'disbursement','disb4',115000000,'Sanggar Seni Kaligrafi Al-Haramain'),
    ('n3','Laporan Progres Harian Baru','Update progres: Tahap Akhir Pengecatan Ornamen Kaligrafi Kubah dilaporkan berprogres ke 100%.','1 hari yang lalu',1,'progress',NULL,NULL,NULL),
    ('n4','Penyaluran Dana Berhasil','Rp 145.000.000,00 disalurkan ke Artistic Dome Specialist Yogyakarta untuk pekerjaan perakitan besi kubah induk.','5 hari yang lalu',1,'disbursement','disb3',145000000,'Artistic Dome Specialist Yogyakarta')
  `);
  console.log('✅ Notifications done!');

  await db.query(`INSERT IGNORE INTO admins (username, password, name, role) VALUES
    ('superadmin','$2b$10$95ut6fc0iYzH.SoOJRqFB.GCp2jRc7YVXfcf/h24rhvgwqvgaldp2','Super Admin Masjid An-Nur','superadmin'),
    ('panitia1','$2b$10$95ut6fc0iYzH.SoOJRqFB.GCp2jRc7YVXfcf/h24rhvgwqvgaldp2','Panitia Pembangunan','panitia'),
    ('bendahara1','$2b$10$95ut6fc0iYzH.SoOJRqFB.GCp2jRc7YVXfcf/h24rhvgwqvgaldp2','Bendahara Masjid','bendahara')
  `);
  console.log('✅ Admins done!');

  console.log('🎉 Semua data berhasil diisi!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});