import express from "express";
import {
  getAllKeluarga,
  createKeluarga,
  updateKeluarga,
  deleteKeluarga,
} from "../controllers/keluargaController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAllKeluarga).post(createKeluarga);
router.route("/:id").put(updateKeluarga).delete(deleteKeluarga);

export default router;
