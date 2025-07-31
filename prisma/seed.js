// file: backend/prisma/seed.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log(`Mulai proses seeding user perangkat desa...`);

  // 1. Hapus data lama
  await prisma.user.deleteMany();

  // 2. Buat satu akun user
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      email: "perangkatdesa@email.com",
      nama: "Budi Santoso",
      password: hashedPassword,
    },
  });

    console.log(`User   berhasil dibuat: ${user.nama}`);
  console.log(`Seeding selesai.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
