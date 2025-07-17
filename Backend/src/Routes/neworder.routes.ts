import { Router } from "express";
import { authMiddleware as authAdmin } from "../Middlewares/middlewareAdmin";
import { addOrderItemAdmin, confirmOrderAdmin, deleteOrderItemAdmin, getOrderItemsAdmin, updateOrderItemAdmin } from "../Controllers/neworder.controller";
const router = Router();

router.get("/neworder/:id", authAdmin, getOrderItemsAdmin);

router.post("/neworder", authAdmin, addOrderItemAdmin)

router.put("/neworder", authAdmin, updateOrderItemAdmin);

router.delete("/neworder", authAdmin, deleteOrderItemAdmin);

router.post("/neworder/confirm", authAdmin, confirmOrderAdmin);


export default router;
