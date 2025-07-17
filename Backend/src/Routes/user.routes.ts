import { Router } from "express";
import { authMiddleware } from "../Middlewares/middlewares";
import { authMiddleware as authAdmin } from "../Middlewares/middlewareAdmin";
import {
  deleteUser,
  editUser,
  getUserID,
  getUserOrder,
  getUsers,
} from "../Controllers/user.controller";
const router = Router();

router.get("/user/order", authMiddleware, getUserOrder);

router.put("/user", authMiddleware, editUser);

router.get("/users", authAdmin, getUsers);

router.get("/user/:id", authAdmin, getUserID);

router.delete("/user/:userId", authAdmin, deleteUser);

export default router;
