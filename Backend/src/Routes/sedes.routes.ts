import { Router } from "express";
import { authMiddleware } from "../Middlewares/middlewareAdmin";
import {
  getSedes,
  getSedeId,
  createSede,
  updateSede,
  deleteSede,
} from "../Controllers/sedes.controller";
const router = Router();

router.get("/sedes", getSedes);

router.get("/sedes/:id", getSedeId);

router.post("/sedes", authMiddleware, createSede);

router.put("/sedes/:id", authMiddleware, updateSede);

router.delete("/sedes/:id", authMiddleware, deleteSede);

export default router;
