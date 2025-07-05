// file: backend/src/controllers/pendudukController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllPenduduk = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const search = req.query.search || "";
  const dusunId = req.query.dusunId; // <-- AMBIL PARAMETER BARU

  const skip = (page - 1) * pageSize;

  try {
    // Kondisi pencarian dasar
    const searchClause = {
      OR: [
        { nama_lengkap: { contains: search, mode: "insensitive" } },
        { nik: { contains: search, mode: "insensitive" } },
        { keluarga: { nomor_kk: { contains: search, mode: "insensitive" } } },
      ],
    };

    // Gabungkan dengan kondisi filter dusun jika ada
    const whereClause = { ...searchClause };
    if (dusunId && dusunId !== "all") {
      whereClause.keluarga = {
        ...whereClause.keluarga,
        dusunId: parseInt(dusunId),
      };
    }

    const totalItems = await prisma.penduduk.count({ where: whereClause });

    const penduduk = await prisma.penduduk.findMany({
      skip: skip,
      take: pageSize,
      where: whereClause,
      include: {
        keluarga: {
          include: {
            dusun: true,
          },
        },
      },
      orderBy: {
        nama_lengkap: "asc",
      },
    });

    res.status(200).json({
      data: penduduk,
      pagination: {
        totalItems: totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
        currentPage: page,
        pageSize: pageSize,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data penduduk", error: error.message });
  }
};

// Menambah SATU data penduduk baru
export const createPenduduk = async (req, res) => {
  const { nik, nama_lengkap, keluargaId, ...dataLainnya } = req.body;
  if (!nik || !nama_lengkap || !keluargaId) {
    return res
      .status(400)
      .json({ message: "NIK, Nama Lengkap, dan Keluarga wajib diisi" });
  }

  try {
    const newPenduduk = await prisma.penduduk.create({
      data: {
        nik,
        nama_lengkap,
        keluargaId: parseInt(keluargaId), // Pastikan ID adalah integer
        ...dataLainnya,
      },
    });
    res
      .status(201)
      .json({ message: "Penduduk berhasil ditambahkan", data: newPenduduk });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menambah data penduduk", error: error.message });
  }
};

export const updatePenduduk = async (req, res) => {
  const { id: paramId } = req.params;

  // Ambil dan abaikan field yang tidak boleh di-update (id, keluarga, dusun)
  const { id: bodyId, keluargaId, keluarga, ...data } = req.body;

  try {
    // Buat payload yang bersih untuk di-update
    const dataToUpdate = {
      ...data, // Sisa data yang aman (nama, nik, dll)
      keluargaId: parseInt(keluargaId), // Pastikan keluargaId adalah integer
    };

    const updatedPenduduk = await prisma.penduduk.update({
      where: { id: parseInt(paramId) },
      data: dataToUpdate,
    });
    res.status(200).json(updatedPenduduk);
  } catch (error) {
    console.error("Update Penduduk Error:", error);
    res
      .status(500)
      .json({ message: "Gagal mengupdate penduduk", error: error.message });
  }
};

// DELETE /api/penduduk/:id - Menghapus penduduk
export const deletePenduduk = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.penduduk.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Penduduk berhasil dihapus" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghapus penduduk", error: error.message });
  }
};
