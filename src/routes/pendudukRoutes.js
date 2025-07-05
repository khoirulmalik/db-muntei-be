// file: backend/src/routes/pendudukRoutes.js
import express from "express";
import {
  getAllPenduduk,
  createPenduduk,
  updatePenduduk,
  deletePenduduk,
} from "../controllers/pendudukController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getAllPenduduk).post(protect, createPenduduk);
router.route("/:id").put(updatePenduduk).delete(deletePenduduk);

export default router;
