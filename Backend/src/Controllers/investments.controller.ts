import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getLosses = async (req: Request, res: Response) => {
  try {
    const losses = await prisma.investments_Losses.findMany({
      include: {
        Sede: true,
      },
    });

    if (!losses) throw new Error("No se encontraron perdidas o inversiones");

    return res
      .status(200)
      .json({ data: losses, message: "Datos de perdidas o inversiones" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Ocurrió un error al actualizar la sede",
    });
  }
};

export const addLosses = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { price, description } = req.body;

  try {
    const losses = await prisma.investments_Losses.create({
      data: {
        description,
        price,
        sedeId: id,
      },
      include: {
        Sede: true,
      },
    });

    const sede = await prisma.sede.findUnique({
      where: { id },
      include: {
        losses: true,
      },
    });

    if (!sede) {
      throw new Error("Sede no encontrada");
    }

    const totalLosses = sede.losses.reduce((sum, loss) => sum + loss.price, 0);

    await prisma.sede.update({
      where: { id },
      data: {
        finalLosses: totalLosses,
      },
    });

    return res.status(200).json({
      message: "Datos actualizados exitosamente",
      data: losses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Ocurrió un error al actualizar la sede",
    });
  }
};
