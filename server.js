// server.js (Versi ES6)
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./src/routes/authRoutes.js";
import pendudukRoutes from "./src/routes/pendudukRoutes.js";
import keluargaRoutes from "./src/routes/keluargaRoutes.js";
import dusunRoutes from "./src/routes/dusunRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Backend is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/penduduk", pendudukRoutes);
app.use("/api/keluarga", keluargaRoutes);
app.use("/api/dusun", dusunRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Server ES6 berjalan di http://localhost:${PORT}`);
});
