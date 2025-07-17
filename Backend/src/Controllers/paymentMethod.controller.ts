import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPaymentMethod = async (req: Request, res: Response) => {
  try {
    const paymentMethod = await prisma.paymentMethod.findMany({
      include: {
        _count: {
          select: {
            payment: true,
          },
        },
      },
    });

    res.status(200).json({
      data: paymentMethod,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const createPaymentMethod = async (req: Request, res: Response) => {
  try {
    const { cardImage, cardNumber, phoneNumber, paymentOptions } = req.body;

    console.table([cardImage, cardNumber, paymentOptions]);

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        cardImage,
        paymentOptions,
        cardNumber,
        phoneNumber: phoneNumber,
      },
      include: {
        _count: {
          select: {
            payment: true,
          },
        },
      },
    });

    res.status(200).json({
      data: paymentMethod,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const updatePaymentMethod = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { cardImage, cardNumber, phoneNumber, paymentOptions } = req.body;

    const paymentMethod = await prisma.paymentMethod.update({
      where: {
        id,
      },
      data: {
        cardImage: cardImage,
        paymentOptions,
        cardNumber: cardNumber,
        phoneNumber: phoneNumber,
      },
      include: {
        _count: {
          select: {
            payment: true,
          },
        },
      },
    });

    res.status(200).json({
      data: paymentMethod,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const deletePaymentMethod = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ message: "Id no encontrada." });
    }

    const paymentMethod = await prisma.paymentMethod.delete({
      where: {
        id,
      },
    });

    if (!paymentMethod) {
      return res.status(404).json({ message: "Metodo de pago no encontrado." });
    }

    return res
      .status(200)
      .json({ message: "Metodo de pago eliminado con exito" });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
