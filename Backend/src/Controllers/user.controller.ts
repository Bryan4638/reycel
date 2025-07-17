import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

export const getUserOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const client = await prisma.client.findUnique({
      where: {
        id: userId,
      },
      select: {
        baseUser: {
          select: {
            isDeleted: true,
          },
        },
        orders: {
          where: {
            pending: true,
          },
          select: {
            _count: true,
            id: true,
            orderItems: true,
            totalAmount: true,
          },
        },
      },
    });

    if (!client || client.baseUser.isDeleted) {
      return res
        .status(404)
        .json({ error: "Cliente no encontrado o eliminado." });
    }

    res.status(200).json({
      data: {
        orders: client.orders,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener las órdenes del cliente." });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany({
      where: {
        baseUser: {
          isDeleted: false,
        },
      },
      select: {
        id: true,
        baseUser: {
          select: {
            username: true,
            image: true,
            status: true,
            createdAt: true,
            email: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    res.json(
      clients.map((client) => ({
        userId: client.id,
        username: client.baseUser.username,
        image: client.baseUser.image,
        status: client.baseUser.status,
        orderCount: client._count.orders,
        createdAt: client.baseUser.createdAt,
        email: client.baseUser.email,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los clientes." });
  }
};

export const getUserID = async (req: Request, res: Response) => {
  try {
    const userID = req.params.id as string;

    if (!userID) {
      return res.status(403).json({ message: "Falta el id del usuario" });
    }

    const client = await prisma.client.findUnique({
      where: {
        id: userID,
      },
      select: {
        id: true,
        baseUser: {
          select: {
            username: true,
            image: true,
            status: true,
            createdAt: true,
            isDeleted: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!client || client.baseUser.isDeleted) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.status(200).json({
      data: {
        id: client.id,
        username: client.baseUser.username,
        image: client.baseUser.image,
        status: client.baseUser.status,
        orderCount: client._count.orders,
        createdAt: client.baseUser.createdAt,
      },
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const { username, password, image } = req.body;
    const userId = req.userId;

    const client = await prisma.client.findUnique({
      where: { id: userId },
      include: {
        baseUser: true,
      },
    });

    if (!client || client.baseUser.isDeleted) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const hashedPassword = password
      ? await bcryptjs.hash(password, 10)
      : undefined;

    const updatedBaseUser = await prisma.baseUser.update({
      where: {
        id: client.baseUser.id,
      },
      data: {
        username: username || undefined,
        image: image || undefined,
        password: hashedPassword,
      },
    });

    res.status(200).json({
      data: {
        id: client.id,
        username: updatedBaseUser.username,
        image: updatedBaseUser.image,
        status: updatedBaseUser.status,
        createdAt: updatedBaseUser.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar el usuario." });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const client = await prisma.client.findUnique({
      where: { id: userId },
      include: {
        baseUser: true,
      },
    });

    if (!client || client.baseUser.isDeleted) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await prisma.baseUser.update({
      where: {
        id: client.baseUser.id,
      },
      data: {
        isDeleted: true,
      },
    });

    res.status(200).json({
      message: "Usuario eliminado con éxito",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el usuario." });
  }
};
