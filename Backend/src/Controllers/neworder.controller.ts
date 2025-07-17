import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import prismaNew from "../Middlewares/prisma";
import { error } from "console";
const prisma = new PrismaClient();

export const getOrderItemsAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "El id es requerido" });
    }

    const order = await prisma.order.findFirst({
      where: {
        AND: [{ pending: true }, { adminId: id }],
      },
      select: {
        id: true,
        createdAt: true,
        totalAmount: true,
        _count: {
          select: {
            orderItems: true,
          },
        },
        orderItems: {
          select: {
            id: true,
            createdAt: true,
            price: true,
            quantity: true,
            product: {
              select: {
                imagen: true,
                name: true,
                ratingAverage: true,
                inventoryCount: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    const items = order?.orderItems;

    if (!items) {
      return res.status(404).json({ message: "Productos no encontrados" });
    }

    return res.status(200).json({
      data: order,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const addOrderItemAdmin = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const productID = (req.query.p || "") as string;
    const quantity = parseInt(req.body.quantity) || 1;

    const priceProduct = await prisma.product.findUnique({
      where: {
        id: productID,
      },
      select: {
        price: true,
      },
    });

    if (!priceProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const priceTotal = priceProduct?.price * quantity;

    let orderFind = await prisma.order.findFirst({
      where: {
        adminId: userId,
        pending: true,
      },
      include: {
        orderItems: true,
      },
    });

    const productfind = orderFind?.orderItems.find(
      (product) => product.productId === productID
    );

    if (productfind) {
      return res.status(203).json({ message: "Producto repetido" });
    }

    if (!orderFind) {
      orderFind = await prisma.order.create({
        data: {
          adminId: userId,
          pending: true,
          totalAmount: 0,
        },
        include: {
          orderItems: true,
        },
      });
    }

    const data = await prisma.order.update({
      where: {
        id: orderFind.id,
      },
      data: {
        orderItems: {
          create: {
            quantity,
            price: priceTotal,
            productId: productID,
          },
        },
        totalAmount: orderFind.totalAmount + priceTotal,
      },
      select: {
        id: true,
        createdAt: true,
        totalAmount: true,
        _count: {
          select: {
            orderItems: true,
          },
        },
        orderItems: {
          select: {
            id: true,
            createdAt: true,
            price: true,
            quantity: true,
            product: {
              select: {
                imagen: true,
                name: true,
                ratingAverage: true,
                inventoryCount: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    res
      .status(200)
      .json({ data: data, message: "Producto añadido a la orden." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el Producto a la orden." });
  }
};

export const deleteOrderItemAdmin = async (req: Request, res: Response) => {
  try {
    const orderID = (req.query.p || "") as string;

    const orderItem = await prismaNew.orderItem.delete({
      where: {
        id: orderID,
      },
      select: {
        orderId: true,
      },
    });

    const data = await prisma.order.findFirst({
      where: {
        id: orderItem.orderId,
      },
      select: {
        id: true,
        createdAt: true,
        totalAmount: true,
        _count: {
          select: {
            orderItems: true,
          },
        },
        orderItems: {
          select: {
            id: true,
            createdAt: true,
            price: true,
            quantity: true,
            product: {
              select: {
                imagen: true,
                name: true,
                ratingAverage: true,
                inventoryCount: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el Producto al carrito." });
  }
};

export const updateOrderItemAdmin = async (req: Request, res: Response) => {
  try {
    const orderID = (req.query.p || "") as string;
    const quantity = parseInt(req.body.quantity) || 1;
    const price = parseInt(req.body.price) || 1;

    const newPrice = price * quantity;

    const orderItem = await prismaNew.orderItem.update({
      where: {
        id: orderID,
      },
      data: {
        price: newPrice,
        quantity: quantity,
      },
      select: {
        orderId: true,
      },
    });

    const data = await prisma.order.findFirst({
      where: {
        id: orderItem.orderId,
      },
      select: {
        id: true,
        createdAt: true,
        totalAmount: true,
        _count: {
          select: {
            orderItems: true,
          },
        },
        orderItems: {
          select: {
            id: true,
            createdAt: true,
            price: true,
            quantity: true,
            product: {
              select: {
                imagen: true,
                name: true,
                ratingAverage: true,
                inventoryCount: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el Producto al carrito." });
  }
};

export const confirmOrderAdmin = async (req: Request, res: Response) => {
  try {
    const orderID = req.body.orderID;
    const transactionID = req.body.transactionID || null;
    const amount = req.body.amount;
    const fastDelivery = false;
    const paymentMethod = req.body.paymentMethod;
    const adminId = req.userId;
    const direction = req.body.sede;

    //Datos de la orden
    const order = await prismaNew.order.findFirst({
      where: {
        id: parseInt(orderID),
      },
      select: {
        orderItems: {
          select: {
            quantity: true,
            product: {
              select: {
                id: true,
                inventoryCount: true,
                price: true,
                investments: true,
                category: {
                  select: {
                    name: true,
                    profitsBySell: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) res.status(500).json({ error: "Error al confirmar la orden" });

    //Datos del ususario
    const user = await prisma.administrator.findUnique({
      where: {
        id: adminId,
      },
      select: {
        mouthSalary: true,
        sedeId: true,
        sede: {
          select: {
            netProfits: true,
          },
        },
      },
    });

    if (!user) res.status(500).json({ error: "Error al confirmar la orden" });

    //Datos de la sede
    const sede = await prisma.sede.findFirst({
      where: {
        direction,
      },
      select: {
        netProfits: true,
        id: true,
      },
    });

    if (!sede) res.status(500).json({ error: "Error al confirmar la orden" });

    if (user && sede && order) {
      let NewSalary = user.mouthSalary;

      order.orderItems.map(async (item) => {
        const quantity = item.quantity;
        const categoryGain = item.product.category.profitsBySell;

        const Inversion = (item.product.investments || 0) * quantity;
        const Venta = item.product.price * quantity;

        const newQuantity = item.product.inventoryCount - quantity;
        const newNetProfits = sede.netProfits + Venta - Inversion;

        NewSalary = NewSalary + quantity * categoryGain;

        //Modificar cantidad en el inventario
        await prisma.product.update({
          where: {
            id: item.product.id,
          },
          data: {
            inventoryCount: newQuantity,
          },
        });

        //Modificar Ganancia Neta
        await prisma.sede.update({
          where: {
            id: sede.id,
          },
          data: {
            netProfits: newNetProfits,
          },
        });

        //Modificar Salario
        await prisma.administrator.update({
          where: {
            id: adminId,
          },
          data: {
            mouthSalary: NewSalary,
          },
        });
      });
    }

    await prismaNew.order.update({
      where: {
        id: parseInt(orderID),
      },
      data: {
        pending: false,
      },
    });

    await prisma.payment.create({
      data: {
        transactionID,
        orderId: Number(orderID),
        amount,
        fastDelivery,
        paymentMethodId: paymentMethod,
        adminId,
        paymentStatus: "COMPLETED",
      },
    });

    let data = await prisma.order.findFirst({
      where: {
        adminId: adminId,
        pending: true,
      },
      include: {
        orderItems: true,
      },
    });

    if (!data) {
      data = await prisma.order.create({
        data: {
          adminId: adminId,
          pending: true,
          totalAmount: 0,
        },
        include: {
          orderItems: true,
        },
      });
    }

    res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al confirmar la orden" });
  }
};
