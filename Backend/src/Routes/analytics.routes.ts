import { Router } from "express";
import { authMiddleware } from "../Middlewares/middlewareAdmin";
import { paymentsRequest, bestSellingProduct, generalData, sedeWithMostSales, sedeWithLeastSales, leastSoldProduct } from "../Controllers/analytics.controller";


const router = Router();

router.get("/", authMiddleware , generalData)

router.post("/payments", authMiddleware , paymentsRequest)

router.post("/bestSellingProduct", authMiddleware , bestSellingProduct)

router.post("/leastSoldProduct", authMiddleware , leastSoldProduct)

router.post("/sedeWithMostSales", authMiddleware , sedeWithMostSales)

router.post("/sedeWithLeastSales", authMiddleware , sedeWithLeastSales)

export default router;