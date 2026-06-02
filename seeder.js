const db = require('./db');

async function seed() {
  console.log('🌱 Mulai mengisi data donor...');

  // Insert donors
  await db.query(`INSERT IGNORE INTO donors VALUES
    ('swadaya_base','Dana Swadaya Awal Masjid An-Nur','panitia.annur@gmail.com','081100000000','https://images.unsplash.com/photo-1590076211181-4351cddc290c?auto=format&fit=crop&w=150&h=150&q=80','one-time','inactive',250000000,NULL,NULL,NULL,NULL,NULL),
    ('d1','Ir. H. Budi Hartono','budi.hartono@gmail.com','081123456789','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80','monthly','active',60000000,2500000,3,24,36,'2026-05-10'),
    ('d2','Siti Rahmawati, S.E.','siti.rahma@outlook.com','081298765432','https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80','monthly','active',24000000,1000000,2,24,24,'2026-05-05'),
    ('d3','Ahmad Fauzan','fauzan_tambang@gmail.com','085712345678','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80','monthly','active',45000000,3000000,2,15,24,'2026-05-12'),
    ('d4','dr. Hendra Wijaya Sp.PD','hendra.wijaya@klinikpratama.com','081112223334','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80','monthly','active',96000000,4000000,3,24,36,'2026-05-20'),
    ('d5','Prof. Dr. Hj. Eliyana','eliyana.unair@yahoo.com','081388889999','https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80','monthly','active',30000000,1500000,2,20,24,'2026-05-15'),
    ('d6','H. Rahmat Sujatmiko (Donasi GRC)','rahmat.sujatmiko@sujatmiko-corp.id','081255556666','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80','one-time','inactive',250000000,NULL,NULL,NULL,NULL,NULL),
    ('d7','Hamba Allah (Jakarta)','hamba.allah.jkt@gmail.com','081199990000','https://images.unsplash.com/photo-1550521820-29168df2c1d6?auto=format&fit=crop&w=150&h=150&q=80','one-time','inactive',150000000,NULL,NULL,NULL,NULL,NULL),
    ('d8','Warga Blok B (Bumi Daya Indah)','kolektif.blokb@gmail.com','081511112222','https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80','one-time','inactive',37500000,NULL,NULL,NULL,NULL,NULL)
  `);

  console.log('✅ Donor berhasil diisi!');

  // Insert donation records
  await db.query(`INSERT IGNORE INTO donation_records VALUES
    ('dh_base_1','swadaya_base',250000000,'2026-04-01','one-time','Dana Kas Awal Swadaya Pengurus & Jamaah Bumi Daya Indah','INV/SWD/2026/04/001','sukses'),
    ('dh1_1','d1',2500000,'2026-05-10','monthly','Iuran Bulanan Masjid An-Nur - Bulan Ke-24','INV/MHD/2026/05/012','sukses'),
    ('dh1_2','d1',2500000,'2026-04-10','monthly','Iuran Bulanan Masjid An-Nur - Bulan Ke-23','INV/MHD/2026/04/008','sukses'),
    ('dh1_3','d1',2500000,'2026-03-10','monthly','Iuran Bulanan Masjid An-Nur - Bulan Ke-22','INV/MHD/2026/03/015','sukses'),
    ('dh1_4','d1',52500000,'2026-02-15','monthly','Akumulasi iuran bulan 1 s/d 21','INV/MHD/2026/02/099','sukses'),
    ('dh2_1','d2',1000000,'2026-05-05','monthly','Iuran Bulanan Masjid An-Nur - Bulan Ke-24 (LUNAS)','INV/MHD/2026/05/002','sukses'),
    ('dh2_2','d2',1000000,'2026-04-05','monthly','Iuran Bulanan Masjid An-Nur - Bulan Ke-23','INV/MHD/2026/04/002','sukses'),
    ('dh2_3','d2',22000000,'2026-03-01','monthly','Konsolidasi Pembayaran Bulan Ke-1 sampai Ke-22','INV/MHD/2026/03/001','sukses'),
    ('dh3_1','d3',3000000,'2026-05-12','monthly','Iuran Bulanan Masjid An-Nur - Bulan Ke-15','INV/MHD/2026/05/019','sukses'),
    ('dh3_2','d3',3000000,'2026-04-12','monthly','Iuran Bulanan Masjid An-Nur - Bulan Ke-14','INV/MHD/2026/04/011','sukses'),
    ('dh3_3','d3',39000000,'2026-03-12','monthly','Konsolidasi Pembayaran Iuran Bulan ke-1 s/d 13','INV/MHD/2026/03/020','sukses'),
    ('dh4_1','d4',4000000,'2026-05-20','monthly','Iuran Bulanan Masjid An-Nur - Bulan Ke-24','INV/MHD/2026/05/042','sukses'),
    ('dh4_2','d4',4000000,'2026-04-20','monthly','Iuran Bulanan Masjid An-Nur - Bulan Ke-23','INV/MHD/2026/04/035','sukses'),
    ('dh4_3','d4',88000000,'2026-03-15','monthly','Konsolidasi Iuran Bulan ke-1 s/d 22','INV/MHD/2026/03/050','sukses'),
    ('dh5_1','d5',1500000,'2026-05-15','monthly','Iuran Bulanan Masjid An-Nur - Bulan Ke-20','INV/MHD/2026/05/028','sukses'),
    ('dh5_2','d5',1500000,'2026-04-15','monthly','Iuran Bulanan Masjid An-Nur - Bulan Ke-19','INV/MHD/2026/04/027','sukses'),
    ('dh5_3','d5',27000000,'2026-03-20','monthly','Konsolidasi Iuran Bulan ke-1 sampai 18','INV/MHD/2026/03/062','sukses'),
    ('dh6_1','d6',250000000,'2026-04-20','one-time','Donasi Pembelian Bahan GRC Ornamen Kubah Masjid','INV/OBN/2026/04/100','sukses'),
    ('dh7_1','d7',150000000,'2026-05-12','one-time','Donasi Khusus Bor Pile Utama & Cor Cakar Ayam','INV/OBN/2026/05/088','sukses'),
    ('dh8_1','d8',37500000,'2026-05-25','one-time','Donasi Kolektif Paving Parkir Blok B Perumahan','INV/OBN/2026/05/104','sukses')
  `);

  console.log('✅ Riwayat donasi berhasil diisi!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});