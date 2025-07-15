import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSedes = async (req: Request, res: Response) => {
  try {
    const sedes = await prisma.sede.findMany({
      select: {
        id: true,
        direction: true,
        image: true,
        phone: true,
        netProfits: true,
        losses: true,
        _count:{
          select:{
            producto: true
          }
        },
        finalLosses: true,
        rent: true,
        workers: {
          select: {
            baseUser: {
              select: {
                username: true,
                image: true,
              },
            },
            id: true,
          },
        },
      },
    });

    res.status(200).json({
      data: sedes,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const getSedeId = async (req: Request, res: Response) => {
  try {
    const id = req.query.idSede as string;

    if (!id) {
      return res.status(404).json("Id no encontrada.");
    }

    const sedes = await prisma.sede.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        direction: true,
        image: true,
        phone: true,
        workers: {
          select: {
            baseUser: {
              select: {
                username: true,
                image: true,
              },
            },
            id: true,
          },
        },
      },
    });

    if (!sedes) {
      return res.status(404).json("Sede no encontrada.");
    }

    res.status(200).json({
      data: sedes,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const createSede = async (req: Request, res: Response) => {
  const { phone, image, direction, rent } = req.body;

  try {
    if (!phone || !direction || !image) {
      console.log("Datos inválidos o incompletos");
      return res.status(400).json({ error: "Datos inválidos o incompletos" });
    }

    const newSede = await prisma.sede.create({
      data: {
        phone: parseInt(phone),
        image,
        direction,
        rent,
      },
      include: {
        workers: true,
      },
    });

    return res.status(201).json({
      data: newSede,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Ocurrió un error al crear la sede",
    });
  }
};

export const updateSede = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { phone, image, direction, rent } = req.body;

  try {
    const existingSede = await prisma.sede.findUnique({ where: { id } });
    if (!existingSede) {
      return res.status(404).json({ error: "Sede no encontrada" });
    }

    const updatedSede = await prisma.sede.update({
      where: { id },
      data: {
        phone: parseInt(phone),
        image,
        direction,
        rent,
      },
      include: {
        workers: true,
      },
    });

    return res.status(200).json({
      message: "Sede actualizada exitosamente",
      sede: updatedSede,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Ocurrió un error al actualizar la sede",
    });
  }
};

export const deleteSede = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existingSede = await prisma.sede.findUnique({ where: { id } });
    if (!existingSede) {
      return res.status(404).json({ error: "Sede no encontrada" });
    }

    await prisma.sede.delete({ where: { id } });

    return res.status(200).json({ message: "Sede eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Ocurrió un error al eliminar la sede",
    });
  }
};
