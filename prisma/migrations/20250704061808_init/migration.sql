-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dusun" (
    "id" SERIAL NOT NULL,
    "nama_dusun" TEXT NOT NULL,

    CONSTRAINT "Dusun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keluarga" (
    "id" SERIAL NOT NULL,
    "nomor_kk" TEXT NOT NULL,
    "nama_kepala_keluarga" TEXT NOT NULL,
    "alamat" TEXT,
    "dusunId" INTEGER,

    CONSTRAINT "Keluarga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penduduk" (
    "id" SERIAL NOT NULL,
    "nik" TEXT,
    "nama_lengkap" TEXT NOT NULL,
    "tempat_lahir" TEXT,
    "tanggal_lahir" TIMESTAMP(3),
    "jenis_kelamin" TEXT,
    "nama_ayah" TEXT,
    "nama_ibu" TEXT,
    "agama" TEXT,
    "pendidikan" TEXT,
    "pekerjaan" TEXT,
    "keterangan" TEXT,
    "status_hubungan" TEXT,
    "keluargaId" INTEGER NOT NULL,

    CONSTRAINT "Penduduk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dusun_nama_dusun_key" ON "Dusun"("nama_dusun");

-- CreateIndex
CREATE UNIQUE INDEX "Keluarga_nomor_kk_key" ON "Keluarga"("nomor_kk");

-- CreateIndex
CREATE UNIQUE INDEX "Penduduk_nik_key" ON "Penduduk"("nik");

-- AddForeignKey
ALTER TABLE "Keluarga" ADD CONSTRAINT "Keluarga_dusunId_fkey" FOREIGN KEY ("dusunId") REFERENCES "Dusun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penduduk" ADD CONSTRAINT "Penduduk_keluargaId_fkey" FOREIGN KEY ("keluargaId") REFERENCES "Keluarga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
