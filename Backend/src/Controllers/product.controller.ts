import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { SortItem } from "../types";
import { SERVER_URL } from "../conf";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const prisma = new PrismaClient();

export const getProductID = async (req: Request, res: Response) => {
  try {
    const productID = (req.query.p || "") as string;

    const product = await prisma.product.findUnique({
      where: { id: productID },
      include: {
        Rating: true,
        comment: {
          select: {
            content: true,
            createdAt: true,
            updatedAt: true,
            id: true,
            client: {
              select: {
                baseUser: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        },
        category: {
          select: {
            name: true,
            id: true,
          },
        },
      }, // Incluye los ratings asociados
    });

    if (!product) {
      return res.status(404).json(["Dispositivo no encontrado."]);
    }

    const averageRating =
      product?.Rating.length > 0
        ? product.Rating.reduce((sum, rating) => sum + rating.value, 0) /
          product.Rating.length
        : 0;

    //product.rating = averageRating

    res.status(200).json({
      data: product,
      averageRating,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(["Internal server error"]);
  }
};

export const searchProduct = async (req: Request, res: Response) => {
  try {
    const search = (req.query.s || "") as string;

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 15;

    //filters
    const minPrice = parseInt(req.query.minPrice as string) || 0;

    const maxPrice = parseInt(req.query.maxPrice as string) || 1000000;

    const category = (req.query.category as string) || undefined;

    const categories = category?.split(",");

    const color = (req.query.color as string) || undefined;

    const rating = parseInt(req.query.rating as string) || undefined;

    //sort
    const sortQuery =
      req.query.sort && typeof req.query.sort === "string"
        ? req.query.sort
        : "[]";

    const sortArray: SortItem[] = JSON.parse(sortQuery);

    // Validar y construir el objeto orderBy para Prisma
    const orderBy = sortArray.map((sortItem: SortItem) => {
      const { field, order } = sortItem;
      return { [field]: order }; // Formato esperado por Prisma
    });

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    console.log(maxPrice);

    const result = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            category: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
        AND: [
          {
            price: {
              gte: minPrice,
              lte: maxPrice,
            },
          },
          {
            category: {
              id: {
                in: categories,
              },
            },
          },
          {
            color: color,
          },
          {
            ratingAverage: rating,
          },
        ],
      },
      include: {
        Rating: true,
        category: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy,
      skip: skip,
      take: take,
    });

    const totalProduct = await prisma.product.count({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            category: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
        AND: [
          {
            price: {
              gte: minPrice,
              lte: maxPrice,
            },
          },
          {
            category: {
              id: {
                in: categories,
              },
            },
          },
          {
            color: color,
          },
          {
            ratingAverage: rating,
          },
        ],
      },
    });

    const productWithRatings = result.map((product) => ({
      ...product,
      rating:
        product.Rating.length > 0
          ? (
              product.Rating.reduce((sum, rating) => sum + rating.value, 0) /
              product.Rating.length
            ).toFixed(1)
          : 0,
    }));

    const totalPages = Math.ceil(totalProduct / pageSize);

    res.status(200).json({
      data: productWithRatings,
      meta: {
        totalProduct,
        page,
        totalPages,
        pageSize,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(["Internal server error"]);
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        comment: true,
        Rating: true,
        Sede: {
          select: {
            direction: true,
            phone: true,
            image: true,
          },
        },
        category: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    const productWithRatings = products.map((product) => ({
      ...product,
      rating:
        product.Rating.length > 0
          ? (
              product.Rating.reduce((sum, rating) => sum + rating.value, 0) /
              product.Rating.length
            ).toFixed(1)
          : 0,
    }));

    res.status(200).json({
      data: productWithRatings,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      categoryId,
      price,
      inventoryCount,
      rating,
      ram,
      storage,
      battery,
      mpxCameraFront,
      mpxCameraBack,
      sedeId,
      investments,
    } = req.body;

    const file = req.file;

    const imagen = `${SERVER_URL}/public/webp/${file?.filename}.webp`;
    const originImage = `${SERVER_URL}/public/${file?.filename}`;

    const userId = req.userId;

    const originalPath = path.join(__dirname, `../Upload/${file?.filename}`);
    const webpPath = path.join(
      __dirname,
      `../Upload/webp/${file?.filename}.webp`
    );

    // Procesar imagen a WebP con resolución reducida
    await sharp(originalPath)
      .resize(500, 500, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 50 })
      .toFile(webpPath);

    if (ram && storage && battery && mpxCameraBack && mpxCameraFront) {
      const product = await prisma.product.create({
        data: {
          name,
          description,
          categoryId,
          price: Number(price),
          imagen,
          originImage,
          inventoryCount: Number(inventoryCount),
          inicialInventory: Number(inventoryCount),
          ram: Number(ram),
          storage: Number(storage),
          battery: Number(battery),
          mpxCameraBack: Number(mpxCameraBack),
          mpxCameraFront: Number(mpxCameraFront),
          sedeId,
          investments: Number(investments),
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          Sede: {
            select: {
              direction: true,
              phone: true,
              image: true,
            },
          },
        },
      });

      await prisma.rating.create({
        data: {
          productID: product.id,
          administratorId: userId,
          value: Number(rating),
        },
      });

      res.status(200).json({
        data: product,
      });
    } else {
      const product = await prisma.product.create({
        data: {
          name,
          description,
          categoryId,
          price: Number(price),
          imagen,
          originImage,
          inventoryCount: Number(inventoryCount),
          inicialInventory: Number(inventoryCount),
          sedeId,
          investments: Number(investments),
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          Sede: {
            select: {
              direction: true,
              phone: true,
              image: true,
            },
          },
        },
      });

      await prisma.rating.create({
        data: {
          productID: product.id,
          administratorId: userId,
          value: Number(rating),
        },
      });

      res.status(200).json({
        data: product,
      });
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userId = req.userId;

    await prisma.rating.deleteMany({
      where: {
        AND: [
          {
            productID: id,
          },
          {
            administratorId: userId,
          },
        ],
      },
    });

    const product = await prisma.product.delete({
      where: {
        id,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (product.imagen) {
      const publicDir = path.join(__dirname, "..", "Upload");
      const fileName = product.imagen.split("/public/")[1]; // obtiene 'nombre-archivo.jpg'
      const pathImage = path.join(publicDir, fileName);
      // Elimina la imagen si existe
      if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
      }
    }

    return res.status(200).json({ message: "Producto eliminado con exito" });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      categoryId,
      price,
      inventoryCount,
      rating,
      ram,
      storage,
      battery,
      mpxCameraFront,
      mpxCameraBack,
      sedeId,
      investments,
    } = req.body;

    const userId = req.userId;
    let imagen = req.body.imagen;
    let originImage = req.body.originImage;
    const file = req.file;

    if (file) {
      imagen = `${SERVER_URL}/public/webp/${file.filename}.webp`;
      originImage = `${SERVER_URL}/public/${file.filename}`;
      const originalPath = path.join(__dirname, `../Upload/${file.filename}`);
      const webpPath = path.join(
        __dirname,
        `../Upload/webp/${file.filename}.webp`
      );
      await sharp(originalPath)
        .resize(500, 500, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 50 })
        .toFile(webpPath);

      // Opcional: eliminar imagen anterior si existe y se reemplaza
      const productOld = await prisma.product.findUnique({ where: { id } });
      if (
        productOld &&
        productOld.imagen &&
        productOld.originImage &&
        productOld.imagen !== imagen &&
        productOld.originImage !== originImage
      ) {
        try {
          const publicDir = path.join(__dirname, "..", "Upload");
          const fileName = productOld.imagen.split("/public/")[1];
          const fileNameOroginal = productOld.originImage.split("/public/")[1];
          const pathImage = path.join(publicDir, fileName);
          const pathImageOriginal = path.join(publicDir, fileNameOroginal);
          if (fs.existsSync(pathImage) && fs.existsSync(pathImageOriginal)) {
            fs.unlinkSync(pathImageOriginal);
            fs.unlinkSync(pathImage);
          }
        } catch (e) {
          // No hacer nada si falla
        }
      }
    }

    if (ram || storage || battery || mpxCameraBack || mpxCameraFront) {
      const product = await prisma.product.update({
        where: { id: id },
        data: {
          name,
          description,
          categoryId,
          price: Number(price),
          imagen,
          originImage,
          inventoryCount: Number(inventoryCount),
          ram: Number(ram),
          storage: Number(storage),
          battery: Number(battery),
          mpxCameraBack: Number(mpxCameraBack),
          mpxCameraFront: Number(mpxCameraFront),
          sedeId,
          investments: Number(investments),
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          Sede: {
            select: {
              direction: true,
              phone: true,
              image: true,
            },
          },
        },
      });

      if (rating !== undefined) {
        const existingRating = await prisma.rating.findFirst({
          where: {
            productID: id,
            administratorId: userId,
          },
        });

        if (existingRating) {
          await prisma.rating.update({
            where: {
              id: existingRating.id,
            },
            data: {
              value: Number(rating),
            },
          });
        } else {
          await prisma.rating.create({
            data: {
              productID: id,
              administratorId: userId,
              value: Number(rating),
            },
          });
        }
      }

      res.status(200).json({
        data: product,
      });
    } else {
      const product = await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          categoryId,
          price: Number(price),
          imagen,
          originImage,
          inicialInventory: Number(inventoryCount),
          sedeId,
          investments: Number(investments),
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          Sede: {
            select: {
              direction: true,
              phone: true,
              image: true,
            },
          },
        },
      });

      if (rating !== undefined) {
        const existingRating = await prisma.rating.findFirst({
          where: {
            productID: id,
            administratorId: userId,
          },
        });

        if (existingRating) {
          await prisma.rating.update({
            where: {
              id: existingRating.id,
            },
            data: {
              value: Number(rating),
            },
          });
        } else {
          await prisma.rating.create({
            data: {
              productID: id,
              administratorId: userId,
              value: Number(rating),
            },
          });
        }
      }

      res.status(200).json({
        data: product,
      });
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};
