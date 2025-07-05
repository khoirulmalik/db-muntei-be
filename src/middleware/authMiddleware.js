// file: backend/src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Ambil token dari header ('Bearer TOKEN')
      token = req.headers.authorization.split(" ")[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Simpan data user ke request (opsional, tapi berguna)
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Token tidak valid, otorisasi gagal" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Tidak ada token, otorisasi gagal" });
  }
};
