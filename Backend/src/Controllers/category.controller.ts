import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCategory = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        profitsBySell: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    res.status(200).json({
      data: categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(["Internal server error"]);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, profitsBySell } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        profitsBySell,
      },
      select: {
        id: true,
        name: true,
        profitsBySell: true,
        createdAt: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    res.status(200).json({
      data: category,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, profitsBySell } = req.body;
    const { id } = req.params;

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
        profitsBySell,
      },
      select: {
        id: true,
        name: true,
        profitsBySell,
        createdAt: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    res.status(200).json({
      data: category,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      data: category,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
