import express from "express";
import {
  getAllDusun,
  createDusun,
  updateDusun,
  deleteDusun,
} from "../controllers/dusunController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Lindungi semua route di bawah ini

router.route("/").get(getAllDusun).post(createDusun);
router.route("/:id").put(updateDusun).delete(deleteDusun);

export default router;
