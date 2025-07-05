import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET /api/dusun - Mengambil semua dusun
export const getAllDusun = async (req, res) => {
  try {
    const dusun = await prisma.dusun.findMany({
      orderBy: { nama_dusun: "asc" },
    });
    res.status(200).json(dusun);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data dusun", error: error.message });
  }
};

// POST /api/dusun - Membuat dusun baru
export const createDusun = async (req, res) => {
  try {
    const newDusun = await prisma.dusun.create({ data: req.body });
    res.status(201).json(newDusun);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal membuat dusun", error: error.message });
  }
};

// PUT /api/dusun/:id - Mengupdate dusun
export const updateDusun = async (req, res) => {
  const { id: paramId } = req.params;
  const { id: bodyId, ...data } = req.body; // Abaikan ID dari body

  try {
    const updatedDusun = await prisma.dusun.update({
      where: { id: parseInt(paramId) },
      data: data, // Hanya gunakan sisa data
    });
    res.status(200).json(updatedDusun);
  } catch (error) {
    console.error("Update Dusun Error:", error);
    res
      .status(500)
      .json({ message: "Gagal mengupdate dusun", error: error.message });
  }
};

// DELETE /api/dusun/:id - Menghapus dusun
export const deleteDusun = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.dusun.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Dusun berhasil dihapus" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghapus dusun", error: error.message });
  }
};
