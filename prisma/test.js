// File: import.mjs
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';

const prisma = new PrismaClient();

console.log("--- SCRIPT DENGAN LOGIKA BARU MULAI BERJALAN ---");

// Konfigurasi
const CSV_FILE_PATH = 'toktuk.csv'; // Pastikan nama file CSV Anda sudah bersih
const NAMA_DUSUN = 'TOKTUK';

async function main() {
  console.log('🚀 Memulai proses impor...');

  // 1. Baca seluruh data dari CSV ke memori
  const dataPenduduk = [];
  await new Promise((resolve, reject) => {
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (row) => {
        if (row.NIK && row['NOMOR KK']) {
          dataPenduduk.push(row);
        }
      })
      .on('end', () => {
        console.log(`✅ File CSV berhasil dibaca. Ditemukan ${dataPenduduk.length} baris data valid.`);
        resolve();
      })
      .on('error', reject);
  });

  // LANGKAH BARU 1: Kelompokkan penduduk berdasarkan NOMOR KK
  const keluargaDataMap = new Map();
  for (const penduduk of dataPenduduk) {
    const no_kk = penduduk['NOMOR KK'];
    if (!keluargaDataMap.has(no_kk)) {
      keluargaDataMap.set(no_kk, []);
    }
    keluargaDataMap.get(no_kk).push(penduduk);
  }
  console.log(`👨‍👩‍👧‍👦 Data berhasil dikelompokkan ke dalam ${keluargaDataMap.size} keluarga.`);

  // LANGKAH BARU 2: Tentukan kepala keluarga untuk setiap KK dengan logika baru
  const kepalaKeluargaMap = new Map();
  for (const [no_kk, anggotaKeluarga] of keluargaDataMap.entries()) {
    let namaKepalaKeluarga = null;

    // Cari kandidat utama: orang pertama yang punya 'No Urut KK'
    const kandidatUtama = anggotaKeluarga.find(p => p['No Urut KK'] && p['No Urut KK'].trim() !== '');

    if (kandidatUtama) {
      // Validasi 1: Apakah kandidat utama adalah AYAH dari anggota lain?
      const isAyah = anggotaKeluarga.some(
        anggota => anggota['NAMA AYAH']?.toUpperCase() === kandidatUtama['NAMA LENGKAP'].toUpperCase()
      );

      if (isAyah) {
        namaKepalaKeluarga = kandidatUtama['NAMA LENGKAP'];
      } else {
        // Validasi 2: Jika bukan ayah, gunakan logika gender
        if (kandidatUtama['L/P'].toUpperCase() === 'L') {
          namaKepalaKeluarga = kandidatUtama['NAMA LENGKAP']; // Laki-laki adalah kepala keluarga
        } else {
          // Jika kandidat utama perempuan, cek apakah ada laki-laki lain di KK (kemungkinan suami)
          const suamiPotensial = anggotaKeluarga.find(p => p['L/P'].toUpperCase() === 'L');
          if (suamiPotensial) {
            namaKepalaKeluarga = suamiPotensial['NAMA LENGKAP']; // Utamakan suami
          } else {
            namaKepalaKeluarga = kandidatUtama['NAMA LENGKAP']; // Jika tidak ada laki-laki, dia adalah kepala keluarga
          }
        }
      }
    } else if (anggotaKeluarga.length > 0) {
      // Fallback jika tidak ada 'No Urut KK' sama sekali
      namaKepalaKeluarga = anggotaKeluarga[0]['NAMA LENGKAP'];
    }

    if (namaKepalaKeluarga) {
      kepalaKeluargaMap.set(no_kk, namaKepalaKeluarga.toUpperCase());
    }
  }
  console.log(`🗺️  Peta kepala keluarga berhasil dibuat untuk ${kepalaKeluargaMap.size} keluarga.`);


  // 3. Pastikan Dusun ada di database
  const dusun = await prisma.dusun.upsert({
    where: { nama_dusun: NAMA_DUSUN },
    update: {},
    create: { nama_dusun: NAMA_DUSUN },
  });

  // 4. Proses setiap baris data (bagian ini tetap sama)
  for (const pendudukData of dataPenduduk) {
    try {
      const no_kk = pendudukData['NOMOR KK'];
      const nik = pendudukData.NIK;
      const namaKepalaKeluarga = kepalaKeluargaMap.get(no_kk);

      if (!namaKepalaKeluarga) {
        console.warn(`⚠️  Data untuk ${pendudukData['NAMA LENGKAP']} dilewati karena kepala keluarga tidak dapat ditentukan.`);
        continue;
      }

      const keluarga = await prisma.keluarga.upsert({
        where: { nomor_kk: no_kk },
        update: {},
        create: {
          nomor_kk: no_kk,
          nama_kepala_keluarga: namaKepalaKeluarga,
          alamat: `Dusun ${dusun.nama_dusun}`,
          dusunId: dusun.id,
        },
      });

      const [tempat_lahir, tgl_lahir_str] = pendudukData['TEMPAT TANGGAL LAHIR'].split(/,\s*/, 2);
      const [tgl, bln, thn] = tgl_lahir_str.split('/');
      const tanggal_lahir = new Date(`${thn}-${bln}-${tgl}`);

      let status_hubungan = 'Anggota Keluarga';
      const namaLengkapUpper = pendudukData['NAMA LENGKAP'].toUpperCase();
      
      // =================== PERBAIKAN DI SINI ===================
      // Ambil kembali data anggota keluarga dari peta agar tersedia di dalam scope ini
      const anggotaKeluarga = keluargaDataMap.get(no_kk);
      // =======================================================

      if (namaLengkapUpper === namaKepalaKeluarga) {
        status_hubungan = 'Kepala Keluarga';
      } else if (pendudukData['NAMA AYAH']?.toUpperCase() === namaKepalaKeluarga) {
        status_hubungan = 'Anak';
      } else if (pendudukData['L/P'].toUpperCase() === 'P') {
        // Cek apakah dia istri dari kepala keluarga
        const suami = anggotaKeluarga.find(p => p['NAMA LENGKAP'].toUpperCase() === namaKepalaKeluarga);
        if (suami && suami['NAMA IBU']?.toUpperCase() === namaLengkapUpper) {
            status_hubungan = 'Istri';
        } else if (pendudukData.PEKERJAAN?.toUpperCase() === 'RUMAH TANGGA') {
            status_hubungan = 'Istri'; // Fallback jika nama ibu tidak tercatat
        }
      }

      await prisma.penduduk.upsert({
        where: { nik: nik },
        update: {
          nama_lengkap: pendudukData['NAMA LENGKAP'],
          pendidikan: pendudukData.PENDIDIKAN,
          pekerjaan: pendudukData.PEKERJAAN,
          keterangan: pendudukData.KETERANGAN,
          keluargaId: keluarga.id,
          status_hubungan: status_hubungan,
        },
        create: {
          nik: nik,
          nama_lengkap: pendudukData['NAMA LENGKAP'],
          tempat_lahir: tempat_lahir,
          tanggal_lahir: isNaN(tanggal_lahir.getTime()) ? null : tanggal_lahir,
          jenis_kelamin: pendudukData['L/P'].toUpperCase() === 'L' ? 'Laki-laki' : 'Perempuan',
          nama_ayah: pendudukData['NAMA AYAH'],
          nama_ibu: pendudukData['NAMA IBU'],
          agama: pendudukData.AGAMA,
          pendidikan: pendudukData.PENDIDIKAN,
          pekerjaan: pendudukData.PEKERJAAN,
          keterangan: pendudukData.KETERANGAN,
          status_hubungan: status_hubungan,
          keluargaId: keluarga.id,
        },
      });
      console.log(`✔️  Berhasil memproses: ${pendudukData['NAMA LENGKAP']} (Status: ${status_hubungan})`);
    } catch (error) {
      console.error(`❌ Gagal memproses data untuk ${pendudukData['NAMA LENGKAP']}:`, error);
    }
  }
}

main()
  .catch((e) => console.error('Terjadi kesalahan fatal:', e))
  .finally(async () => {
    await prisma.$disconnect();
    console.log('✅ Proses impor selesai. Koneksi database ditutup.');
  });
