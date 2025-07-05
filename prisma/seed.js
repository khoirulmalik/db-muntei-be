// file: backend/prisma/seed.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Data referensi untuk generate random data
const namaDepan = [
  "Ahmad",
  "Budi",
  "Siti",
  "Dewi",
  "Joko",
  "Rina",
  "Agus",
  "Sri",
  "Bambang",
  "Indira",
  "Dedi",
  "Wati",
  "Hendra",
  "Lestari",
  "Rudi",
  "Sari",
  "Wahyu",
  "Fitri",
  "Eko",
  "Ratna",
  "Yudi",
  "Endang",
  "Candra",
  "Mila",
  "Darmawan",
  "Yanti",
  "Sutrisno",
  "Ani",
  "Purnama",
  "Tri",
  "Imam",
  "Nurul",
  "Faisal",
  "Sinta",
  "Hadi",
  "Maya",
  "Arif",
  "Dina",
  "Ridwan",
  "Putri",
  "Bayu",
  "Lia",
  "Rizki",
  "Nita",
  "Fajar",
  "Evi",
  "Doni",
  "Rini",
  "Wisnu",
  "Septi",
];

const namaBelakang = [
  "Subarjo",
  "Susilo",
  "Wijaya",
  "Santoso",
  "Pratama",
  "Utomo",
  "Saputra",
  "Rahayu",
  "Kurniawan",
  "Sari",
  "Hidayat",
  "Purnomo",
  "Setiawan",
  "Wulandari",
  "Hakim",
  "Lestari",
  "Nugroho",
  "Maharani",
  "Cahyono",
  "Anggraini",
  "Permana",
  "Handayani",
  "Wardana",
  "Safitri",
  "Sudirman",
  "Kartika",
  "Mulyono",
  "Indraswari",
  "Subagyo",
  "Paramita",
  "Syahputra",
  "Oktavia",
  "Suryana",
  "Melani",
  "Gunawan",
  "Fitriana",
  "Hermawan",
  "Kusuma",
  "Hamdani",
  "Salsabila",
  "Ramadhan",
  "Aprilia",
  "Firmansyah",
  "Puspita",
  "Maulana",
  "Azzahra",
  "Setiadi",
  "Amelia",
  "Wibowo",
  "Nabila",
];

const tempatLahir = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Medan",
  "Semarang",
  "Makassar",
  "Palembang",
  "Tangerang",
  "Depok",
  "Bekasi",
  "Bogor",
  "Yogyakarta",
  "Malang",
  "Padang",
  "Denpasar",
  "Bandar Lampung",
  "Pekanbaru",
  "Jambi",
  "Cirebon",
  "Tasikmalaya",
  "Sukabumi",
  "Serang",
  "Cilegon",
  "Karawang",
  "Purwakarta",
  "Subang",
  "Indramayu",
  "Kuningan",
  "Majalengka",
  "Sumedang",
];

const agamaList = [
  "Islam",
  "Kristen",
  "Katolik",
  "Hindu",
  "Buddha",
  "Konghucu",
];

const pendidikanList = [
  "Tidak Sekolah",
  "SD",
  "SMP",
  "SMA",
  "SMK",
  "D1",
  "D2",
  "D3",
  "S1",
  "S2",
  "S3",
];

const pekerjaanList = [
  "Petani",
  "Buruh",
  "Wiraswasta",
  "PNS",
  "Guru",
  "Dokter",
  "Perawat",
  "Polisi",
  "TNI",
  "Pedagang",
  "Sopir",
  "Tukang",
  "Montir",
  "Cleaning Service",
  "Satpam",
  "Karyawan Swasta",
  "Mahasiswa",
  "Pelajar",
  "Ibu Rumah Tangga",
  "Pensiunan",
  "Belum Bekerja",
  "Freelancer",
  "Teknisi",
  "Desainer",
  "Programmer",
];

const statusHubunganList = [
  "KEPALA KELUARGA",
  "ISTRI",
  "ANAK",
  "ORANG TUA",
  "MERTUA",
  "MENANTU",
  "CUCU",
];

const dusunNames = ["Mawar", "Melati", "Dahlia", "Anggrek", "Kenanga"];

// Helper functions
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomName() {
  return `${getRandomItem(namaDepan)} ${getRandomItem(namaBelakang)}`;
}

function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function generateNIK(baseNumber, sequence) {
  const year = Math.floor(Math.random() * 30) + 1970; // 1970-1999
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  const seqNum = String(sequence).padStart(4, "0");
  return `${baseNumber}${day}${month}${year.toString().slice(-2)}${seqNum}`;
}

function generateNoKK(dusunIndex, familyIndex) {
  const baseKK = "3201010101";
  const dusunCode = String(dusunIndex + 1).padStart(2, "0");
  const familyCode = String(familyIndex + 1).padStart(4, "0");
  return `${baseKK}${dusunCode}${familyCode}`;
}

function shouldHaveData(percentage = 80) {
  return Math.random() * 100 < percentage;
}

function generateFamilyMembers(familySize, keluargaId, nikBase) {
  const members = [];
  const kepalaKeluarga = getRandomName();

  // Kepala keluarga
  members.push({
    nik: shouldHaveData() ? generateNIK(nikBase, 1) : null,
    nama_lengkap: kepalaKeluarga,
    tempat_lahir: shouldHaveData() ? getRandomItem(tempatLahir) : null,
    tanggal_lahir: shouldHaveData()
      ? getRandomDate(new Date(1950, 0, 1), new Date(1990, 11, 31))
      : null,
    jenis_kelamin: "Laki-laki",
    nama_ayah: shouldHaveData() ? getRandomName() : null,
    nama_ibu: shouldHaveData() ? getRandomName() : null,
    agama: shouldHaveData() ? getRandomItem(agamaList) : null,
    pendidikan: shouldHaveData() ? getRandomItem(pendidikanList) : null,
    pekerjaan: shouldHaveData() ? getRandomItem(pekerjaanList) : null,
    keterangan: shouldHaveData()
      ? Math.random() > 0.7
        ? "Aktif"
        : null
      : null,
    status_hubungan: "KEPALA KELUARGA",
    keluargaId: keluargaId,
  });

  // Istri (jika ada)
  if (familySize > 1) {
    members.push({
      nik: shouldHaveData() ? generateNIK(nikBase, 2) : null,
      nama_lengkap: getRandomName(),
      tempat_lahir: shouldHaveData() ? getRandomItem(tempatLahir) : null,
      tanggal_lahir: shouldHaveData()
        ? getRandomDate(new Date(1955, 0, 1), new Date(1995, 11, 31))
        : null,
      jenis_kelamin: "Perempuan",
      nama_ayah: shouldHaveData() ? getRandomName() : null,
      nama_ibu: shouldHaveData() ? getRandomName() : null,
      agama: shouldHaveData() ? getRandomItem(agamaList) : null,
      pendidikan: shouldHaveData() ? getRandomItem(pendidikanList) : null,
      pekerjaan: shouldHaveData() ? getRandomItem(pekerjaanList) : null,
      keterangan: shouldHaveData()
        ? Math.random() > 0.7
          ? "Aktif"
          : null
        : null,
      status_hubungan: "ISTRI",
      keluargaId: keluargaId,
    });
  }

  // Anak-anak
  for (let i = 2; i < familySize; i++) {
    const isChild = i < Math.min(familySize - 1, 5); // Maksimal 3 anak per keluarga
    const gender = Math.random() > 0.5 ? "Laki-laki" : "Perempuan";

    members.push({
      nik: shouldHaveData() ? generateNIK(nikBase, i + 1) : null,
      nama_lengkap: getRandomName(),
      tempat_lahir: shouldHaveData() ? getRandomItem(tempatLahir) : null,
      tanggal_lahir: shouldHaveData()
        ? getRandomDate(
            isChild ? new Date(1990, 0, 1) : new Date(1930, 0, 1),
            isChild ? new Date(2020, 11, 31) : new Date(1970, 11, 31)
          )
        : null,
      jenis_kelamin: gender,
      nama_ayah: shouldHaveData() ? kepalaKeluarga : null,
      nama_ibu: shouldHaveData()
        ? members[1]?.nama_lengkap || getRandomName()
        : null,
      agama: shouldHaveData() ? getRandomItem(agamaList) : null,
      pendidikan: shouldHaveData() ? getRandomItem(pendidikanList) : null,
      pekerjaan: shouldHaveData() ? getRandomItem(pekerjaanList) : null,
      keterangan: shouldHaveData()
        ? Math.random() > 0.7
          ? "Aktif"
          : null
        : null,
      status_hubungan: isChild
        ? "ANAK"
        : getRandomItem(["ORANG TUA", "MERTUA", "CUCU"]),
      keluargaId: keluargaId,
    });
  }

  return members;
}

async function main() {
  console.log(`Mulai proses seeding untuk 2000 penduduk...`);

  // 1. Hapus data lama
  await prisma.penduduk.deleteMany();
  await prisma.keluarga.deleteMany();
  await prisma.dusun.deleteMany();
  await prisma.user.deleteMany();

  // 2. Buat data user
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      email: "perangkatdesa@email.com",
      nama: "Budi Santoso",
      password: hashedPassword,
    },
  });
  console.log(`User dibuat: ${user.nama}`);

  // 3. Buat 5 dusun
  const dusuns = [];
  for (let i = 0; i < 5; i++) {
    const dusun = await prisma.dusun.create({
      data: { nama_dusun: dusunNames[i] },
    });
    dusuns.push(dusun);
    console.log(`Dusun dibuat: ${dusun.nama_dusun}`);
  }

  // 4. Buat 500 keluarga dengan distribusi merata di 5 dusun
  const keluargas = [];
  const familiesPerDusun = 100; // 500 / 5 = 100 keluarga per dusun

  for (let i = 0; i < 500; i++) {
    const dusunIndex = Math.floor(i / familiesPerDusun);
    const familyIndex = i % familiesPerDusun;

    const keluarga = await prisma.keluarga.create({
      data: {
        nomor_kk: generateNoKK(dusunIndex, familyIndex),
        nama_kepala_keluarga: getRandomName(),
        alamat: shouldHaveData()
          ? `Jl. ${getRandomItem([
              "Merdeka",
              "Damai",
              "Sejahtera",
              "Makmur",
              "Tentram",
              "Harmoni",
              "Bahagia",
              "Sentosa",
            ])} No. ${Math.floor(Math.random() * 100) + 1}`
          : null,
        dusunId: dusuns[dusunIndex].id,
      },
    });
    keluargas.push(keluarga);

    if ((i + 1) % 50 === 0) {
      console.log(`${i + 1} keluarga telah dibuat...`);
    }
  }

  // 5. Buat penduduk untuk setiap keluarga
  let totalPenduduk = 0;
  const batchSize = 100; // Insert dalam batch untuk performa
  let pendudukBatch = [];

  for (let i = 0; i < keluargas.length; i++) {
    const keluarga = keluargas[i];

    // Tentukan jumlah anggota keluarga (2-6 orang)
    const remainingPenduduk = 2000 - totalPenduduk;
    const remainingKeluarga = keluargas.length - i;

    let familySize;
    if (remainingKeluarga === 1) {
      familySize = remainingPenduduk; // Keluarga terakhir mengambil sisa
    } else {
      const minSize = Math.max(
        2,
        Math.ceil(remainingPenduduk / remainingKeluarga)
      );
      const maxSize = Math.min(6, remainingPenduduk - remainingKeluarga + 1);
      familySize =
        Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
    }

    // Generate NIK base untuk keluarga ini
    const nikBase = `320101${String(i + 1).padStart(4, "0")}`;

    // Generate anggota keluarga
    const familyMembers = generateFamilyMembers(
      familySize,
      keluarga.id,
      nikBase
    );
    pendudukBatch.push(...familyMembers);
    totalPenduduk += familySize;

    // Insert dalam batch
    if (pendudukBatch.length >= batchSize || i === keluargas.length - 1) {
      await prisma.penduduk.createMany({
        data: pendudukBatch,
        skipDuplicates: true,
      });
      pendudukBatch = [];
    }

    if ((i + 1) % 100 === 0) {
      console.log(
        `${i + 1} keluarga selesai, total penduduk: ${totalPenduduk}`
      );
    }
  }

  // 6. Tampilkan statistik
  const stats = await prisma.penduduk.groupBy({
    by: ["keluargaId"],
    _count: {
      keluargaId: true,
    },
  });

  const dusunStats = await prisma.dusun.findMany({
    include: {
      keluargas: {
        include: {
          penduduks: true,
        },
      },
    },
  });

  console.log("\n=== STATISTIK SEEDING ===");
  console.log(`Total Dusun: ${dusunStats.length}`);
  console.log(`Total Keluarga: ${keluargas.length}`);
  console.log(`Total Penduduk: ${totalPenduduk}`);

  console.log("\nDistribusi per Dusun:");
  dusunStats.forEach((dusun) => {
    const totalPendudukDusun = dusun.keluargas.reduce(
      (sum, kel) => sum + kel.penduduks.length,
      0
    );
    console.log(
      `- ${dusun.nama_dusun}: ${dusun.keluargas.length} keluarga, ${totalPendudukDusun} penduduk`
    );
  });

  console.log(`\nSeeding selesai dengan total ${totalPenduduk} penduduk!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
