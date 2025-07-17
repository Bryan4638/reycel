import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { createToken } from "../Libs/jwt";
import { TOKEN_SECRET } from "../conf";
import jwt from "jsonwebtoken";
import { type TokenPayload } from "../types";
import { sendEmail, sendPasswordResetEmail } from "../Libs/mail.conf";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const baseUserFind = await prisma.baseUser.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
      include: {
        client: true,
      },
    });

    if (baseUserFind?.client) {
      return res
        .status(400)
        .json(["Email o Username ya registrado como cliente"]);
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    // Primero crear el BaseUser con el cliente asociado
    const newBaseUser = await prisma.baseUser.create({
      data: {
        username,
        email,
        password: hashedPassword,
        status: false,
        client: {
          create: {
            orders: {
              create: {
                totalAmount: 0,
              },
            },
          },
        },
      },
      include: {
        client: true,
      },
    });

    if (!newBaseUser.client) {
      throw new Error("Error al crear el cliente");
    }

    const newUser = newBaseUser.client;

    const token = await createToken(String(newUser.id));

    await sendEmail(email, username, token);

    res.json({ message: "Usuario creado, verifique su email" });
  } catch (error) {
    console.log(error);

    res.status(500).json(["Server Error"]);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(401)
        .json(["Necesita username y contraseña para iniciar sesión"]);
    }

    // Buscar el usuario base primero
    const baseUser = await prisma.baseUser.findFirst({
      where: {
        username: username,
      },
      include: {
        client: {
          include: {
            notification: true
          }
        }
      }
    });

    if (!baseUser) {
      return res.status(401).json(["Usuario no encontrado"]);
    }

    if (baseUser.status === false) {
      return res.status(401).json(["Usuario no verificado"]);
    }

    const isMatch = await bcryptjs.compare(password, baseUser.password);

    if (!isMatch) {
      return res.status(401).json(["Contraseña incorrecta"]);
    }

    if (!baseUser.client) {
      return res.status(401).json(["Esta cuenta no es un cliente"]);
    }

    const token = await createToken(String(baseUser.client.id));

    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      domain: '.reycel.com',
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.json({
      username: baseUser.username,
      status: baseUser.status,
      userId: baseUser.client.id,
      notifications: baseUser.client.notification.reverse(),
      image: baseUser.image,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(["Error del servidor"]);
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.send(false);

    const decode = jwt.verify(token, TOKEN_SECRET) as TokenPayload;
    if (!decode) return res.status(401);

    const client = await prisma.client.findUnique({
      where: { id: decode.id },
      include: {
        baseUser: true,
        notification: true
      }
    });

    if (!client || !client.baseUser) return res.status(401).json(["Usuario no encontrado"]);

    return res.json({
      userId: client.id,
      notifications: client.notification.reverse(),
      username: client.baseUser.username,
      status: client.baseUser.status,
    });
  } catch (error) {
    console.log(error);
    return res.send(false);
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: false,
    secure: true,
    domain: '.reycel.com',
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24,
  });
  return res.status(200).json({ message: "logout" });
};

export const confirmEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(401).json(["Usuario no validado"]);
    }

    const decode = jwt.verify(token, TOKEN_SECRET) as TokenPayload;

    const client = await prisma.client.findUnique({
      where: {
        id: decode.id,
      },
      include: {
        baseUser: true,
        notification: true
      }
    });

    if (!client || !client.baseUser) {
      return res.status(404).json(["Usuario no encontrado"]);
    }

    const baseUserUpdated = await prisma.baseUser.update({
      where: {
        id: client.baseUser.id,
      },
      data: {
        status: true,
      },
    });

    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      domain: '.reycel.com',
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.json({
      username: baseUserUpdated.username,
      notifications: client.notification.reverse(),
      status: baseUserUpdated.status,
      userId: client.id,
      image: baseUserUpdated.image,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("Error de JWT", error);
      return res.status(401).json(["Token is not valid"]);
    } else {
      console.error("Error interno del servidor ", error);
      return res.status(500).json(["Internal server error"]);
    }
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(401).json(["Email no válido"]);
    }

    const baseUser = await prisma.baseUser.findUnique({
      where: {
        email: email,
      },
      include: {
        client: true
      }
    });

    if (!baseUser || !baseUser.client) {
      return res.status(404).json(["Usuario no encontrado"]);
    }

    const token = await createToken(String(baseUser.client.id));

    await sendPasswordResetEmail(email, baseUser.username, token);

    res.json({ message: "Email enviado" });
  } catch (error) {
    console.log(error);
    res.status(500).json(["Error del servidor"]);
  }
};

export const confirmResetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(401).json(["Token no validado"]);
    }

    const decode = jwt.verify(token, TOKEN_SECRET) as TokenPayload;

    const client = await prisma.client.findUnique({
      where: {
        id: decode.id,
      },
      include: {
        baseUser: true,
        notification: true
      }
    });

    if (!client || !client.baseUser) {
      return res.status(404).json(["Usuario no encontrado"]);
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const baseUserUpdated = await prisma.baseUser.update({
      where: {
        id: client.baseUser.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      domain: '.reycel.com',
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.json({
      username: baseUserUpdated.username,
      status: baseUserUpdated.status,
      userId: client.id,
      image: baseUserUpdated.image,
      notifications: client.notification.reverse(),
    });
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("Error de JWT", error);
      return res.status(401).json(["Token is not valid"]);
    } else {
      console.error("Error interno del servidor ", error);
      return res.status(500).json(["Internal server error"]);
    }
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    if (!userId) {
      return res.status(401).json(["Usuario no validado"]);
    }

    const client = await prisma.client.findUnique({
      where: {
        id: userId,
      },
      include: {
        baseUser: true
      }
    });

    if (!client || !client.baseUser) {
      return res.status(404).json(["Usuario no encontrado"]);
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await prisma.baseUser.update({
      where: {
        id: client.baseUser.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.json({ message: "Contraseña actualizada" });
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("Error de JWT", error);
      return res.status(401).json(["Token is not valid"]);
    } else {
      console.error("Error interno del servidor ", error);
      return res.status(500).json(["Internal server error"]);
    }
  }
};
