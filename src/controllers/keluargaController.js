import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET /api/keluarga - Mengambil semua keluarga
// file: backend/controllers/keluargaController.js (contoh path)

export const getAllKeluarga = async (req, res) => {
  // 1. Ambil semua parameter dari query URL
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const search = req.query.search || "";
  const dusunId = req.query.dusunId; // Baca parameter dusunId

  const skip = (page - 1) * pageSize;

  try {
    // 2. Siapkan kondisi filter (whereClause) secara dinamis
    const whereClause = {
      AND: [
        {
          OR: [
            { nama_kepala_keluarga: { contains: search, mode: "insensitive" } },
            { nomor_kk: { contains: search, mode: "insensitive" } },
          ],
        },
      ],
    };

    // Jika ada dusunId yang valid (bukan 'all'), tambahkan ke dalam filter
    if (dusunId && dusunId !== "all") {
      whereClause.AND.push({
        dusunId: parseInt(dusunId),
      });
    }

    // 3. Gunakan whereClause yang sudah dinamis untuk mengambil data
    const totalItems = await prisma.keluarga.count({ where: whereClause });

    const keluarga = await prisma.keluarga.findMany({
      skip: skip,
      take: pageSize,
      where: whereClause,
      include: { dusun: true },
      orderBy: { nama_kepala_keluarga: "asc" },
    });

    res.status(200).json({
      data: keluarga,
      pagination: {
        totalPages: Math.ceil(totalItems / pageSize),
        totalItems: totalItems,
        currentPage: page,
        pageSize: pageSize,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data keluarga", error: error.message });
  }
};

// POST /api/keluarga - Membuat keluarga baru
export const createKeluarga = async (req, res) => {
  const { dusunId, ...data } = req.body;
  try {
    const newKeluarga = await prisma.keluarga.create({
      data: { ...data, dusunId: parseInt(dusunId) },
    });
    res.status(201).json(newKeluarga);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal membuat keluarga", error: error.message });
  }
};

// PUT /api/keluarga/:id - Mengupdate keluarga
export const updateKeluarga = async (req, res) => {
  const { id: paramId } = req.params;
  const { id: bodyId, dusunId, ...data } = req.body; // Abaikan ID dari body

  try {
    const dataToUpdate = {
      ...data,
      dusunId: parseInt(dusunId),
    };
    const updatedKeluarga = await prisma.keluarga.update({
      where: { id: parseInt(paramId) },
      data: dataToUpdate,
    });
    res.status(200).json(updatedKeluarga);
  } catch (error) {
    console.error("Update Keluarga Error:", error);
    res
      .status(500)
      .json({ message: "Gagal mengupdate keluarga", error: error.message });
  }
};

// DELETE /api/keluarga/:id - Menghapus keluarga
export const deleteKeluarga = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.keluarga.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Keluarga berhasil dihapus" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghapus keluarga", error: error.message });
  }
};
