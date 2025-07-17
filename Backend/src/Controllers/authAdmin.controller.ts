import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { createToken } from "../Libs/jwt";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types";
import { TOKEN_SECRET } from "../conf";

const prisma = new PrismaClient();

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(401)
        .json(["Necesita usuario y contraseña para iniciar sesión"]);
    }

    const baseUser = await prisma.baseUser.findFirst({
      where: {
        username: userName,
      },
      select: {
        administrator: {
          select: {
            id: true,
            role: true,
            notification: true,
            sede: {
              select: {
                direction: true
              }
            }
          },
        },
        password: true,
        username: true,
        image: true,
      },
    });

    if (!baseUser || !baseUser.administrator) {
      return res.status(401).json(["Usuario no válido"]);
    }

    const isMatch = await bcryptjs.compare(password, baseUser.password);

    if (!isMatch) {
      return res.status(401).json(["Credenciales incorrectas"]);
    }

    const token = await createToken(String(baseUser.administrator.id));

    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });

    res.json({
      username: baseUser.username,
      userId: baseUser.administrator.id,
      image: baseUser.image,
      role: baseUser.administrator.role,
      notifications: baseUser.administrator.notification.reverse(),
      sede: baseUser.administrator.sede?.direction
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(["Error del servidor"]);
  }
};

export const verifyTokenAdmin = async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json(["No autorizado"]);
    }

    const decode = jwt.verify(token, TOKEN_SECRET) as TokenPayload;

    const administrator = await prisma.administrator.findUnique({
      where: {
        id: decode.id,
      },
      select: {
        id: true,
        baseUser: true,
        notification: true,
        role: true,
        sede: {
          select: {
            direction: true
          }
        }
      },
    });

    if (!administrator || !administrator.baseUser) {
      return res.status(404).json(["Administrador no encontrado"]);
    }

    res.json({
      username: administrator.baseUser.username,
      userId: administrator.id,
      image: administrator.baseUser.image,
      role: administrator.role,
      notifications: administrator.notification.reverse(),
      sede: administrator.sede?.direction
    });
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json(["Token no válido"]);
    }
    return res.status(500).json(["Error interno del servidor"]);
  }
};
