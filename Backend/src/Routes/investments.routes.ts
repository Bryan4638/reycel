import { Router } from "express";
import { authMiddleware } from "../Middlewares/middlewareAdmin";
import { addLosses, getLosses } from "../Controllers/investments.controller";

const router = Router();

router.get("/losses", authMiddleware, getLosses);

router.post("/losses/:id", authMiddleware, addLosses);

export default router;
